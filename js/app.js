(($) => {
    // App data
    const appData = (() => {
        const weekleyData = {
            goal: 38,
            missingToAchievementGoal: 12,
            currentStreak: 4,
            bestStreak: 12,
            leaderBoardUsers: [
                {
                    position: 1,
                    name: 'Walter',
                    surname: 'Wynne',
                    distance: 105,
                    workoutDone: true,
                    currentUser: false
                },
                {
                    position: 2,
                    name: 'Annabel',
                    surname: 'Ferdinand',
                    distance: 52,
                    workoutDone: false,
                    currentUser: false
                },
                {
                    position: 3,
                    name: 'Marty',
                    surname: 'McFly',
                    distance: 50,
                    workoutDone: true,
                    currentUser: false
                },
                {
                    position: 7,
                    name: 'Jhon',
                    surname: 'Kowalski',
                    distance: 38,
                    workoutDone: true,
                    currentUser: true
                },
            ]
        };

        const monthlyData = {
            goal: 12,
            missingToAchievementGoal: 186,
            currentStreak: 7,
            bestStreak: 44,
            leaderBoardUsers: [
                {
                    position: 1,
                    name: 'Walter',
                    surname: 'Wynne',
                    distance: 90,
                    workoutDone: true,
                    currentUser: false
                },
                {
                    position: 2,
                    name: 'Annabel',
                    surname: 'Ferdinand',
                    distance: 520,
                    workoutDone: false,
                    currentUser: false
                },
                {
                    position: 3,
                    name: 'Marty',
                    surname: 'McFly',
                    distance: 250,
                    workoutDone: true,
                    currentUser: false
                },
                {
                    position: 7,
                    name: 'Jhon',
                    surname: 'Kowalski',
                    distance: 138,
                    workoutDone: true,
                    currentUser: true
                },
            ]
        }

        return {
            getWeekleyData: () => {
                return weekleyData;
            },
            getMonthlyData: () => {
                return monthlyData;
            }
        }
    })();

    // DOM elements
    const domElements = (() => {
        const domElements = {
            missingToAchievement: '.missing-achievement',
            currentStreak: '.current-streak',
            bestStreak: '.best-streak',
            leaderboardListContainer: '.leaderboard-list',
            currentGoalValue: '.current-goal-value',
            progressBar: '#progress-bar'
        }

        return {
            getDomElements: () => {
                return domElements;
            }
        }
    })();

    // App logic
    const appControler = ((_data, _dom) => {
        // data
        const weekelyData = _data.getWeekleyData();
        const monthlyData = _data.getMonthlyData();

        // DOM
        const domElements = _dom.getDomElements();

        // Build list element
        const buildList = (data) => {
            const $leaderboardListContianer = $(domElements.leaderboardListContainer);

            $leaderboardListContianer.empty();

            const checkUserStatus = (currentUser, workoutStatus) => {
                let userClass = '';
                let workoutClass = '';

                if (currentUser) {
                    userClass = 'current-user';
                }

                if (workoutStatus) {
                    workoutClass = 'active-user';
                }

                return `${userClass} ${workoutClass}`;
            }

            $.each(data, (index, element) => {
                const $listElement = `
                    <li class="list-group-item px-2 ${checkUserStatus(element.currentUser, element.workoutDone)}">
                        <div class="row no-gutters justify-content-between align-items-center">
                            <div class="col-2">
                                <span class="position">${element.position}</span>
                            </div>
                            <div class="col-6">
                                <span>${!element.currentUser ? element.name + ' ' + element.surname : 'You!'}</span>
                            </div>
                            <div class="col-3 pr-2 text-right">
                                <span>${element.distance}m</span>
                            </div>
                            <div class="col-1 text-right">
                                <span class="activity-icon"></span>
                        </div>
                    </li>
                `;
                $leaderboardListContianer.append($listElement);
            });
        }

        // Load data to widget
        const loadData = (interval = 'week') => {
            const $missingAchievement = $(domElements.missingToAchievement);
            const $currentStreak = $(domElements.currentStreak);
            const $bestStreak = $(domElements.bestStreak);
            const $currentGoalValue = $(domElements.currentGoalValue);
            const $progressBar = $(domElements.progressBar);

            if (interval === 'week') {
                $currentGoalValue.text(`${weekelyData.goal}m`);
                $missingAchievement.text(weekelyData.missingToAchievementGoal);
                $currentStreak.text(weekelyData.currentStreak);
                $bestStreak.text(weekelyData.bestStreak);
                buildList(weekelyData.leaderBoardUsers);
            } else if (interval == 'month') {
                $currentGoalValue.text(`${monthlyData.goal}m`);
                $missingAchievement.text(monthlyData.missingToAchievementGoal);
                $currentStreak.text(monthlyData.currentStreak);
                $bestStreak.text(monthlyData.bestStreak);

                // Randomize array for monthly
                let arr = [];
                while(monthlyData.leaderBoardUsers.length != 0) {
                    let randomIndex = Math.floor(Math.random() * monthlyData.leaderBoardUsers.length);

                    arr.push(monthlyData.leaderBoardUsers[randomIndex]);
                    monthlyData.leaderBoardUsers.splice(randomIndex,1);
                }

                monthlyData.leaderBoardUsers = arr;

                buildList(monthlyData.leaderBoardUsers);
            }
        }

        // Change data on select
        const onLeaderBoardChange = () => {
            const $periodSelect = $('#periodSelect');

            $periodSelect.on('change', (event) => {
                const selectedValue = $(event.currentTarget).val();
                loadData(selectedValue);
            })
        }


        return {
            init: () => {

                // Fill widget with data
                loadData();

                // Listen to select change
                onLeaderBoardChange();
            }
        }
    })(appData, domElements);

    appControler.init();
})(jQuery);