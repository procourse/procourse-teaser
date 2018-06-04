import { withPluginApi } from 'discourse/lib/plugin-api';
import { default as DiscourseURL } from 'discourse/lib/url';
import TopicStatus from 'discourse/raw-views/topic-status';

function initializeTeaser(api) {

  TopicStatus.reopen({
    statuses: function(){
      const results = this._super();
      console.log(results);
      if (this.topic.teased) {
        results.push({
          openTag: 'span',
          closeTag: 'span',
          title: I18n.t('procourse_teaser.topic_teased'),
          icon: this.topic.topic_teasing_icon
        });
      }
      return results;
    }.property()
  });
}

export default {
  name: "apply-teaser",

  initialize() {
    withPluginApi('0.1', initializeTeaser);
  }
};
