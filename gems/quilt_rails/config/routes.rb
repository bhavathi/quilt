# frozen_string_literal: true

Quilt::Engine.routes.draw do
  post '/performance_report', to: 'performance_report#create'
  get '/*path', to: 'ui#index'
  root 'ui#index'
end

Rails.application.routes.append do
  mount(Quilt::Engine, at: '/') unless has_named_route?(:quilt)
end
