docker-compose up -d
docker exec -it minka-api npm run db:create:all
docker exec -it minka-api npm run start
docker logs minka-api --follow
