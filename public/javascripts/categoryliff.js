$(window).on('load', function(){
  // Initializes a LIFF app
  liff.init(function (data) {
    initializeApp(data);
  });
});
// $(function(){
//   console.log( "ready!" );
//   $('.categoryitem').click(function (e) {
//     const name = $(this).find('p').text();
//     console.log('name', name);
//   })
// });

const initializeApp = (data) => {
  $('.categoryitem').click(function (e) {
    const categoryID = $(this).data('id');
    const name = $(this).find('p').text();
    $(this).addClass('is-loading');
    $.post( '/api/v1/category/choose', { category_id: categoryID, line_user_id: data.context.userId })
      .done(function (data) {
        liff.sendMessages([{
          type: 'text',
          text: name,
        }]).then(function () {
            liff.closeWindow();
        }).catch(function (error) {
            window.alert("Error " + error);
        });
      })
      .fail(function() {
        alert("error");
      });
  })
}