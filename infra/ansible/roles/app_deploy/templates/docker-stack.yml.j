version: "3.9"

services:
  frontend:
    image: "{{ frontend_image }}:{{ image_tag }}"
    ports:
      - "18080:8080"     # Nginx on host listens :80 and proxies → 127.0.0.1:18080
    environment:
      - API_URL=http://{{ ansible_default_ipv4.address }}:3000/api
    deploy:
      replicas: 1
      restart_policy: { condition: on-failure }
    networks: [rmit_net]

  backend:
    image: "{{ backend_image }}:{{ image_tag }}"
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - MONGO_URI=mongodb://db:27017/rmit_database
      - CLIENT_URL=http://{{ ansible_default_ipv4.address }}    # root (no port) since Nginx serves on :80
      - BASE_API_URL=api
      - JWT_SECRET={{ lookup('password', '/dev/null length=32 chars=ascii_letters,digits') }}
    depends_on: [db]
    deploy:
      replicas: 1
      restart_policy: { condition: on-failure }
    networks: [rmit_net]

  db:
    image: "{{ db_image }}:{{ image_tag }}"
    command: [ "mongod", "--bind_ip_all" ]
    volumes:
      - mongo_data:/data/db
    deploy:
      replicas: 1
      restart_policy: { condition: on-failure }
    networks: [rmit_net]

networks:
  rmit_net:
    external: true

volumes:
  mongo_data:
