import os

from dotenv import load_dotenv
from elasticsearch import AsyncElasticsearch, NotFoundError


load_dotenv()

ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")
es = AsyncElasticsearch(ELASTICSEARCH_URL) if ELASTICSEARCH_URL else None


async def add_to_index(index: str, model) -> None:
    if es is None:
        return
    payload = {
        "title": model.title,
        "body": model.body,
        "categories": model.categories or [],
    }
    await es.index(index=index, id=model.id, document=payload)


async def remove_from_index(index: str, model) -> None:
    if es is None:
        return
    try:
        await es.delete(index=index, id=model.id)
    except NotFoundError:
        pass


async def query_index(index: str, query: str):
    if es is None:
        return []
    search = await es.search(
        index=index,
        query={"multi_match": {
                "query": query,
                "fields": ["title^4", "body", "categories^2"]}}
    )
    return [int(hit["_id"]) for hit in search["hits"]["hits"]]