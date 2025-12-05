/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bsjfba1ne4me8qs")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jxqu6j1f",
    "name": "year",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bsjfba1ne4me8qs")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jxqu6j1f",
    "name": "field",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
