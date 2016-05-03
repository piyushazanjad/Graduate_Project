var app = angular.module('movieapp', [])

app.controller('MovieController', function ($scope, $http) {


    //$(".pay").hide();

    //for opening modals for login and sign up
    $('.modal-trigger').leanModal();

    //for slider
    $('.slider').slider({ full_width: true });
    // Pause slider
    $('.slider').slider('pause');
    // Start slider
    $('.slider').slider('start');
    // Next slide
    $('.slider').slider('next');
    // Previous slide
    $('.slider').slider('prev');

    //dropdown
    $('select').material_select();






    $scope.movies = [];


    $http({
        method: 'GET',
        url: 'http://localhost:3000/movie'
    }).then(function successCallback(response) {

        console.log(response);
        $scope.movies = response.data;

        //$scope.movies.image="E:/473/grad_project/uploads/panda.jpg";




    }, function errorCallback(response) {

    });

    $scope.modalTrigger = function (movie) {

        if ($scope.login.username === "") {

            window.alert("Please login first before booking...!!!");
            $('#login').openModal();


        }
        else {
            $("#" + movie._id).openModal()
            $scope.ticket.movieName = movie.movie_title;
        }
    }
    $scope.select_show = function (show, t) {

        console.log(show, t);
        $scope.ticket.showtime = show.time;
        $scope.ticket.theater = t.theater_name;

    }

    $scope.user = {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        dob: '',
        age: '',
        emailid: ''
    };

    $scope.register = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:3000/users',
            data: $scope.user
        }).then(function successCallback(response) {
            console.log(response.data);
            window.alert("User registered successfully..!! ");
            $('#register').closeModal();
            $('#login').openModal();
        }, function errorCallback(response) {

        });
    }

 $scope.clear_values = function () {
     $scope.login.username="";
     
     $scope.login.password="";


    }



    $scope.showSelectValue = function (mySelect) {
        console.log(mySelect);
        $scope.total_price = mySelect * 10;
        console.log($scope.movies);
        console.log($scope.movies[0].movie_title);
        console.log($scope.ticket.showtime);
        $scope.ticket.seats = mySelect;
        //   console.log(total_price);


    }

    $scope.ticket = {
        movieName: "",
        theater: "",
        showtime: "",
        seats: "",
    }

    $(".pay").hide();

    var updatedShowTime = [];
    $scope.reduce_seats = function (movie) {
        console.log(movie);
        angular.forEach(movie.theaters, function (theater) {

            console.log(theater);
            console.log(movie.theaters);
            console.log(theater.show_timings);

            if (theater.theater_name === $scope.ticket.theater) {

                angular.forEach(theater.show_timings, function (show) {

                    if (show.time === $scope.ticket.showtime) {
                        console.log($scope.ticket.seats);

                        show.remaining_seats = show.remaining_seats - $scope.ticket.seats;

                    }
                    updatedShowTime.push(show);
                    console.log(updatedShowTime);
                    console.log(show);
                });


            }
        });


        $http({
            method: 'POST',
            url: 'http://localhost:3000/movie',
            data: { "ticket": $scope.ticket, "showtime": updatedShowTime }

        }).then(function successCallback(response) {

            console.log(movie);
            console.log($scope.mySelect);
            console.log(response.data);


            window.alert("Updated successfully..!! ");
        }, function errorCallback(response) {

        })

        $(".pay").show();

    }


    $scope.login = {
        username: '',
        password: ''
    }

    console.log($scope.login.username);

    $scope.account_login = function (login) {
        console.log($scope.login);
        console.log($scope.login.username);
        console.log($scope.login.password);
        $http({
            method: 'GET',
            url: 'http://localhost:3000/user_login/' + $scope.login.username
            //  data:{"username": $scope.login.username, "password": $scope.login.password }
        }).then(function successCallback(response) {

            console.log(response);



            if (response.data.length > 0) {
                console.log(response.data.password);
                console.log($scope.login.password);
                if (response.data[0].password === $scope.login.password) {

                    if (response.data[0].password === "admin") {
                        $("#movie_add").show();
                    }


                    $('#login').closeModal();
                    $("#signin").hide();
                    $("#signup").hide();
                    $("#logout").show();


                    window.alert("Login Successful !");
                    //  $scope.login.username='';
                    //$scope.login.password='';
                }

                else {
                    window.alert("Login unsuccessful! Try again !");
                }

            }
            else {
                window.alert("user not found");
            }






        }, function errorCallback(response) {

        });
    }




    $scope.items = [];


    $scope.moviegroup = {
        movie_title: '',
        image: '',
        rating: '',
        category: '',
        desc: '',
        theaters: []
    }


    $scope.theaters = [];
    $scope.inputTheater = {
        theater_name: "",
        show_timings: []
    }

    $scope.show_timings = [];

    $scope.show_timing =
        {
            time: "",
            seats: "",
            remaining_seats: ""
        }


    $scope.showSelectValue1 = function (select_theater) {
        console.log(select_theater);
    }
    $scope.showSelectValue2 = function (select_time) {
        console.log(select_time);
    }
    $scope.showSelectValue3 = function (select_seats) {
        console.log(select_seats);
    }

    $scope.add_shows = function () {
        $scope.show_timing.remaining_seats = $scope.show_timing.seats;
        console.log($scope.show_timing);

        $scope.show_timings.push($scope.show_timing);

        $scope.show_timing = {
            time: "",
            seats: "",
            remaining_seats: ""
        }
    }

    $scope.add_theater = function () {
        $scope.inputTheater.show_timings = $scope.show_timings;
        $scope.show_timings = [];
        $scope.inputTheater.theater_name = $scope.select_theater;
        $scope.select_theater = "";
        $scope.theaters.push($scope.inputTheater);
        $scope.inputTheater = {
            theater_name: "",
            show_timings: []
        };

    }

    $scope.add_movie = function () {

        $scope.moviegroup.theaters = $scope.theaters;
        console.log($scope.moviegroup);





        $http({
            method: 'POST',
            url: 'http://localhost:3000/movies',
            data: $scope.moviegroup
        }).then(function successCallback(response) {
            console.log(response.data);
            window.alert("movie added successfully..!! ");
            $('#addmovie').closeModal();
        }, function errorCallback(response) {

        });


    }


});








