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
      },

      @computed('custom_fields.topic_teasing_url')
      topic_teasing_url: {
        get(urlField) {
          return urlField === "/";
        },
        set(value) {
          value = value || "/";
          this.set("custom_fields.topic_teasing_url", value);
          return value;
        }
      },

      @computed('custom_fields.topic_teasing_icon')
      topic_teasing_icon: {
        get(iconField) {
          return urlField === "shield";
        },
        set(value) {
          value = value || "shield";
          this.set("custom_fields.topic_teasing_icon", value);
          return value;
        }
      }

    });

    TopicRoute.on("setupTopicController", function(event) {
      if (event.currentModel.teased){
        document.location.replace(event.currentModel.topic_teasing_url);
      }
    })

    Topic.reopen({
      
      checkTeaser: function(){
        if (this.model && this.model.teased){
          if (this.model.topic_teasing_url === '/login') {
            document.cookie = `teaser_url=/t/${this.model.id}; path=/`
          }
          document.location.replace(this.model.topic_teasing_url);
        }
      }.observes('model')
    })
  }
};