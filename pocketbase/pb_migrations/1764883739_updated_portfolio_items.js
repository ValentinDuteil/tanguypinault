/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  // remove
  collection.schema.removeField("bce9flut")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bce9flut",
    "name": "size",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "A",
        "B",
        "C",
        "D",
        "E"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
