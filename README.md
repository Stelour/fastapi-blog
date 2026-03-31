# FastAPI-Microblog

Микроблог на FastAPI.

### Зависимости

```bash
pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg alembic python-dotenv pwdlib[argon2] email-validator pyjwt python-multipart elasticsearch[async]
```

---

### Пример быстрого старта

env (пример):
```
SQLALCHEMY_DATABASE_URI=postgresql+asyncpg://x:x@127.0.0.1:5433/x
SECRET_KEY=your_secret_key_here
ELASTICSEARCH_URL=http://127.0.0.1:9200
```

Запуск PostgreSQL при помощи Docker (пример):
```
mkdir -p ~/dockers/fastapi-blog/postgres

docker run -d --name pg_blog \
  -e POSTGRES_USER=x \
  -e POSTGRES_PASSWORD=x \
  -e POSTGRES_DB=x \
  -p 127.0.0.1:5433:5432 \
  -v ~/dockers/fastapi-blog/postgres:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:17
```

Запуск ElasticSearch при помощи Docker (пример):
```
mkdir -p ~/dockers/fastapi-blog/elasticsearch

docker run -d --name es_blog \
  -p 127.0.0.1:9200:9200 \
  --memory="2GB" \
  -e discovery.type=single-node \
  -e xpack.security.enabled=false \
  -v ~/dockers/fastapi-blog/elasticsearch:/usr/share/elasticsearch/data \
  --restart unless-stopped \
  docker.elastic.co/elasticsearch/elasticsearch:9.0.0
```

Инициализация alembic и первая миграция:
```
alembic revision --autogenerate -m "init"
alembic upgrade head
```

Запуск:
```
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

**Стек**:
- FastAPI
- SQLAlchemy Async
- PostgreSQL /asyncpg
- Elasticsearch /AsyncElasticsearch
- Alembic