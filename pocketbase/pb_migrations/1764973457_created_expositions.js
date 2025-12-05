/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9ypfmhp1bwu8n9z",
    "created": "2025-12-05 22:24:17.812Z",
    "updated": "2025-12-05 22:24:17.812Z",
    "name": "expositions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7hdjujbk",
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
        "id": "j8kskbgd",
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
        "id": "d37lipbh",
        "name": "venue",
        "type": "text",
        "required": false,
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
        "id": "5cvc3dib",
        "name": "location",
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
        "id": "qsjxte3y",
        "name": "type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "collective",
            "personnelle",
            "performance"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9ypfmhp1bwu8n9z");

  return dao.deleteCollection(collection);
})
