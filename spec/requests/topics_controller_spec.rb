require 'rails_helper'

describe TopicsController do
  describe 'checking teaser status' do

    before(:each) do
      SiteSetting.procourse_teaser_enabled = true
      @group = Fabricate(:group)
      @category = Fabricate(:private_category, group: @group)
      @category.custom_fields['enable_topic_teasing'] = 'true'
      @category.custom_fields['topic_teasing_url'] = '/login'
      @category.save
      @user = Fabricate(:user)
      @topic = Fabricate(:topic, category: @category)
    end

    context 'category teased and redirected' do
      context 'with user logged out' do
        before(:each) do
          get "/t/#{@topic.id}"
        end

        it 'creates a teaser_url cookie' do
          expect(response.cookies['teaser_url']).to eq("/t/#{@topic.id}")
        end
      end

      context 'with user logged in' do
        before(:each) do
          sign_in(@user)
        end

        subject { get "/t/#{@topic.id}" }

        it 'redirects the user to the correct URL' do
          expect(subject).to redirect_to('/login')
        end
      end

    end
  end
end
