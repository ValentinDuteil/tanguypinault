/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "dhlq3zm6z74zjxo",
    "created": "2025-11-15 07:17:41.606Z",
    "updated": "2025-11-15 07:17:41.606Z",
    "name": "portfolio_items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sqnoeydw",
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
      },
      {
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
      },
      {
        "system": false,
        "id": "bvf36yij",
        "name": "order",
        "type": "number",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "sfknjvd5",
        "name": "breakpoints",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 2,
          "values": [
            "mobile",
            "tablet",
            "desktop"
          ]
        }
      },
      {
        "system": false,
        "id": "em0ycsfv",
        "name": "image",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 5242880,
          "protected": false
        }
      },
      {
        "system": false,
        "id": "snikzu6w",
        "name": "video",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "video/mp4",
            "video/x-ms-wmv",
            "video/quicktime",
            "video/3gpp"
          ],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 5242880,
          "protected": false
        }
      },
      {
        "system": false,
        "id": "qkdo3gw6",
        "name": "text_content",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "dozqurx1",
        "name": "crop_position",
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
            "right",
            "top-left",
            "top-right; bottom-left",
            "bottom-right"
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
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo");

  return dao.deleteCollection(collection);
})
