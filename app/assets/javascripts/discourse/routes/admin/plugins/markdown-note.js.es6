import Route from "@ember/routing/route";

export default class AdminPluginsMarkdownNoteRoute extends Route {
  model() {
    return this.store.findAll("site-setting");
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.loadSettings();
  }
}
