/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  collection.createRule = "(content_type = \"image\" && image != \"\" && video = \"\" && text_content = \"\") ||\n(content_type = \"video\" && video != \"\" && image = \"\" && text_content = \"\") ||\n(content_type = \"text\" && text_content != \"\" && image = \"\" && video = \"\")"
  collection.updateRule = "(content_type = \"image\" && image != \"\" && video = \"\" && text_content = \"\") ||\n(content_type = \"video\" && video != \"\" && image = \"\" && text_content = \"\") ||\n(content_type = \"text\" && text_content != \"\" && image = \"\" && video = \"\")"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhlq3zm6z74zjxo")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
