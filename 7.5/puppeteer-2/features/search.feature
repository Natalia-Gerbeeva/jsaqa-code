Feature: Ticket booking

  Scenario: Book one ticket
    Given user opens cinema page
    When user selects available session
    And user selects 1 seat
    And user clicks booking button
    Then booking confirmation is displayed

  Scenario: Book two tickets
    Given user opens cinema page
    When user selects available session
    And user selects 2 seats
    And user clicks booking button
    Then booking confirmation is displayed

  Scenario: Cannot book without seat selection
    Given user opens cinema page
    When user selects available session
    Then booking button should be disabled