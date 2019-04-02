require 'rails_helper'

describe SessionController do
  describe 'checking for teaser redirection cookies upon login' do
    context 'when logging in locally' do
      before(:each) do
        cookies['teaser_url'] = '/t/100'
        @user = Fabricate(:user)
      end
      it 'sets the destination_url cookie' do
        post '/session.json', params: { login: @user.username, password:'myawesomepassword' }
        expect(cookies['destination_url']).to eq('/t/100')
      end
      it 'removes the teaser_url cookie' do
        post '/session.json', params: { login: @user.username, password:'myawesomepassword' }
        expect(cookies['teaser_url']).to be_empty
      end
    end

    context 'when logging in via sso' do
      before(:each) do
        SiteSetting.sso_url = 'https://procourse.co'
        SiteSetting.sso_secret = 'abcdefg'
        SiteSetting.enable_sso = true
        cookies['teaser_url'] = '/t/100'
      end
      it 'removes the teaser_url cookie' do
        get '/session/sso', params: { return_path: '/' } 
        expect(cookies['teaser_url']).to be_empty
      end
    end
  end
end
