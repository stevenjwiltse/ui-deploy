up:
	docker compose up -d;
	docker compose logs -f barber-shop-ui;
down:
	docker compose down;
restart:
	docker compose down;
	docker compose up -d;
	docker compose logs -f barber-shop-ui;