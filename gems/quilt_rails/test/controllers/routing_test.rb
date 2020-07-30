# frozen_string_literal: true

require "test_helper"
require "action_controller"

module Quilt
  class RoutingTest < ActionDispatch::IntegrationTest
    include ActiveSupport::Testing::Isolation

    setup { boot_dummy }

    test "routes" do
      assert_routing("/", controller: "quilt/ui", action: "index")
      assert_routing("/any_path_here", controller: "quilt/ui", action: "index")
      assert_routing("/performance_report", controller: "quilt/performance", action: "create")
    end

    private

    def boot_dummy
      Rails.env = "development"
      require_relative "../dummy/config/environment"
      @routes = Rails.application.routes
    end
  end
end
