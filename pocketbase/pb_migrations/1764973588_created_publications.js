/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "au0dk7vbl8jybhu",
    "created": "2025-12-05 22:26:28.432Z",
    "updated": "2025-12-05 22:26:28.432Z",
    "name": "publications",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lccc2unt",
        "name": "year",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1900,
          "max": 2100,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "1nuqcco3",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "y3his5tu",
        "name": "source",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "mcsvpxc7",
        "name": "type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "presse",
            "fanzine",
            "podcast"
          ]
        }
      },
      {
        "system": false,
        "id": "uzjmymgh",
        "name": "link",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("au0dk7vbl8jybhu");

  return dao.deleteCollection(collection);
})
