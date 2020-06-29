(($) => {
    const appControler = (() => {
        const onLeaderBoardChange = () => {
            const $periodSelect = $('#periodSelect');

            $periodSelect.on('change', (event) => {
                console.log($(event.currentTarget).val());
            })
        }


        return {
            init: () => {
                console.log('App is running');
                
                onLeaderBoardChange();
            }
        }
    })();

    appControler.init();
})(jQuery);