/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1o1nb2enyt53ycx",
    "created": "2025-12-05 19:50:58.892Z",
    "updated": "2025-12-05 19:50:58.892Z",
    "name": "presentation",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "moqg3p3q",
        "name": "content",
        "type": "editor",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "sossdvtw",
        "name": "text_color",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "dark",
            "beige-light",
            "gold",
            "grey"
          ]
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
  const collection = dao.findCollectionByNameOrId("1o1nb2enyt53ycx");

  return dao.deleteCollection(collection);
})
