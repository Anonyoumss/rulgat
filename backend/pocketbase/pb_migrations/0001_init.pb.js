/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collections = [
    { name: "questions", fields: [
      { name: "qid", type: "text", required: true },
      { name: "lang", type: "text" },
      { name: "section", type: "text" },
      { name: "chapter", type: "number" },
      { name: "topic", type: "text" },
      { name: "topic_id", type: "text" },
      { name: "stem", type: "text" },
      { name: "stem_image", type: "text" },
      { name: "options", type: "json" },
      { name: "answer_index", type: "number" },
      { name: "explanation", type: "text" },
      { name: "difficulty", type: "number" },
      { name: "source", type: "text" },
    ], listRule: "", viewRule: "" },
    { name: "progress", fields: [
      { name: "user", type: "text" },
      { name: "xp", type: "number" },
      { name: "level", type: "number" },
      { name: "streak", type: "number" },
      { name: "coins", type: "number" },
      { name: "vehicle", type: "text" },
      { name: "upgrades", type: "json" },
      { name: "payload", type: "json" },
    ], listRule: "user = @request.auth.id", viewRule: "user = @request.auth.id",
       createRule: "", updateRule: "user = @request.auth.id", deleteRule: "user = @request.auth.id" },
    { name: "stories", fields: [
      { name: "title_ar", type: "text" }, { name: "title_en", type: "text" },
      { name: "topic_id", type: "text" }, { name: "cards", type: "json" },
    ], listRule: "", viewRule: "" },
  ];
  for (const c of collections) {
    try {
      const col = new Collection({ type: "base", name: c.name });
      for (const f of c.fields) col.fields.add(new Field(f));
      if (c.listRule !== undefined) {
        col.listRule = c.listRule; col.viewRule = c.viewRule;
        col.createRule = c.createRule ?? ""; col.updateRule = c.updateRule ?? ""; col.deleteRule = c.deleteRule ?? "";
      }
      app.save(col);
    } catch (e) { /* already exists */ }
  }
}, (app) => {});
