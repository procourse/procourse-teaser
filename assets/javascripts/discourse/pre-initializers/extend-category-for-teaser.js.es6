import computed from 'ember-addons/ember-computed-decorators';
import { on } from "ember-addons/ember-computed-decorators";
import Category from 'discourse/models/category';
import TopicRoute from 'discourse/routes/topic';
import Topic from 'discourse/controllers/topic';
import TopicStatus from 'discourse/raw-views/topic-status';
import { withPluginApi } from 'discourse/lib/plugin-api';

function initialize(api) {
}

export default {
  name: 'extend-category-for-teaser',
  before: 'inject-discourse-objects',
  initialize(container) {

    withPluginApi('0.8.4', api => {
      initialize(api, container);
    });

    Category.reopen({

      @computed('custom_fields.enable_topic_teasing')
      enable_topic_teasing: {
        get(enableField) {
          return enableField === "true";
        },
        set(value) {
          value = value ? "true" : "false";
          this.set("custom_fields.enable_topic_teasing", value);
          return value;
        }
      }

    });

    TopicRoute.on("setupTopicController", function(event) {
      if (event.currentModel.teased){
        document.location.replace("/latest");
      }
    })

    Topic.reopen({
      
      checkTeaser: function(){
        if (this.model && this.model.teased){
          console.log(this.model);
          document.location.replace("/latest");
        }
      }.observes('model')
    })
  }
};