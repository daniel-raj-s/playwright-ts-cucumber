@api
Feature: API Testing

  Scenario: GET a post
    Given an API client
    When I send GET request to "/posts/1"
    Then the response status should be 200
    And the response JSON should have property "id"