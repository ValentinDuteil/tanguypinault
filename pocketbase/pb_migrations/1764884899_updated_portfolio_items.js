/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  collection.listRule = null
  collection.viewRule = null

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dmzvnxof",
    "name": "content_type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "image",
        "video",
        "text"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  collection.listRule = ""
  collection.viewRule = ""

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dmzvnxof",
    "name": "content_type",
    "type": "select",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "image",
        "video",
        "text"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
