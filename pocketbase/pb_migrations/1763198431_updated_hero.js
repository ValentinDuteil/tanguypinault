/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zt10r3xrdycfinq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0acvbzlt",
    "name": "image_position",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "center",
        "top",
        "bottom",
        "left",
        "right"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ntfaqjqs",
    "name": "hero_text_color",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "dark",
        "grey",
        "beige",
        "beige-light",
        "gold"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qq30wwfe",
    "name": "nav_text_color",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "dark",
        "grey",
        "beige",
        "beige-light",
        "gold"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eyrmxlow",
    "name": "nav_hover_color",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "dark",
        "grey",
        "beige",
        "beige-light",
        "gold"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zt10r3xrdycfinq")

  // remove
  collection.schema.removeField("0acvbzlt")

  // remove
  collection.schema.removeField("ntfaqjqs")

  // remove
  collection.schema.removeField("qq30wwfe")

  // remove
  collection.schema.removeField("eyrmxlow")

  return dao.saveCollection(collection)
})
