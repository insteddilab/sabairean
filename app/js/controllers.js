(function() {
  'use strict';  this.AppController = function($scope, $http, localize, $routeParams) {
    $scope.setLanguage = function(language) {
      return localize.setLanguage(language);
    };
    $http.get('chapters/config.json').success(function(data) {
      return $scope.topics = data.topics;
    });
    $scope.get_topic = function($routeParams) {
      var topic, _i, _len, _ref, _results;

      if (!angular.isDefined($scope.topics)) {
        return false;
      }
      _ref = $scope.topics;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        topic = _ref[_i];
        if (topic.key === $routeParams.topic_key) {
          $scope.topic = topic;
          _results.push($scope.chapters = $scope.topic.chapters);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    $scope.get_chapter = function($routeParams) {
      var chapter, _i, _len, _ref, _results;

      $scope.get_topic($routeParams);
      if (!$scope.topic_exists()) {
        return false;
      }
      _ref = $scope.chapters;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chapter = _ref[_i];
        if (chapter.key === $routeParams.chapter_key) {
          _results.push($scope.chapter = chapter);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    $scope.topic_exists = function() {
      if (!angular.isDefined($routeParams.topic_key)) {
        return false;
      }
      return angular.isDefined($scope.topic);
    };
    $scope.chapter_exists = function() {
      if (!angular.isDefined($routeParams.chapter_key)) {
        return false;
      }
      return angular.isDefined($scope.chapter);
    };
    return $scope.get_step = function($routeParams) {};
  };

  this.TopicController = function() {};

  this.ChapterController = function($scope, $routeParams) {
    $scope.get_topic($routeParams);
    return $scope.chapters = $scope.topic.chapters;
  };

  this.StepController = function($scope, $http, $routeParams, localize) {
    var set_step_path;

    $scope.get_chapter($routeParams);
    $scope.path = "chapters/" + $scope.chapter.key;
    set_step_path = function() {
      $scope.step_file = "" + $scope.path + "/i18n/" + localize.language + "/" + $scope.step;
      return $http.get($scope.step_file).error(function() {
        return $scope.step_file = "" + $scope.path + "/" + $scope.step;
      });
    };
    $scope.scope_image = function(image) {
      return "" + $scope.path + "/images/" + image;
    };
    $scope.$on('localizeResourcesUpdates', function() {
      return set_step_path();
    });
    $scope.step = $routeParams.step;
    return $http.get("chapters/" + $scope.chapter.key + "/config.json").success(function(data) {
      $scope.config = data;
      if (typeof $scope.step === 'undefined') {
        $scope.step = data.steps[0];
      }
      return set_step_path();
    });
  };

}).call(this);
