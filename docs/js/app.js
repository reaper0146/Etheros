
App = {

    web3Provider: null,
    contracts: {},
    account: 0X0,
    loading: false,
    articletest: 0,

    init: async () => {
        return App.initWeb3();
    },

    initWeb3: async () => {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                App.displayAccountInfo();
                return App.initContract();

            } catch(error) {
                //user denied access
                console.error("Unable to retrieve your accounts! You have to approve this application on Metamask");
            }
        } else if(window.web3) {
            window.web3 = new Web3(web3.currentProvider || "ws://localhost:8545");
            App.displayAccountInfo();
            return App.initContract();
        } else {
            //no dapp browser
            console.log("Non-ethereum browser detected. You should consider trying Metamask");
        }
    },

    displayAccountInfo: async () => {
        const accounts = await window.web3.eth.getAccounts();
        App.account = accounts[0];
        $('#account').text(App.account);
        const balance = await window.web3.eth.getBalance(App.account);
        $('#accountBalance').text(window.web3.utils.fromWei(balance, "ether") + " ETH");
        //$('#modal-purchase').attr("hidden",true);

    },

    initContract: async () => {
        $.getJSON('Market.json', artifact => {
            App.contracts.Market = TruffleContract(artifact);
            App.contracts.Market.setProvider(window.web3.currentProvider);
            App.listenToEvents();
            return App.reloadArticles();
        });
    },

    // Listen to events raised from the contract
    listenToEvents: async () => {
        const marketInstance = await App.contracts.Market.deployed();
        if(App.logSellArticleEventListener == null) {
            App.logSellArticleEventListener = marketInstance.LogSellArticle({fromBlock: '0'}).on("data", event => {
                    $('#' + event.id).remove();
                    $('#events').append('<li class="list-group-item" id="' + event.id + '">' + event.returnValues._name + ' is for sale</li>');
                    App.reloadArticles();
                })
                .on("error", error => {
                    console.error(error);
                });
        }
        if(App.logBuyArticleEventListener == null) {
            App.logBuyArticleEventListener = marketInstance.LogBuyArticle({fromBlock: '0'}).on("data", event => {
                    $('#' + event.id).remove();
                    $('#events').append('<li class="list-group-item" id="' + event.id + '">' + event.returnValues._buyer + ' bought ' + event.returnValues._name + '</li>' );


                   // $('#modal-bg2').modal('show');
                    //$('#modal-purchase').attr("hidden",false);
                    //$('#purchaselink').text(event.returnValues._hashvalue)



                    App.reloadArticles();
                })
                .on("error", error => {
                    console.error(error);
                });
        }

        $('.btn-subscribe').hide();
        $('.btn-unsubscribe').show();
        $('.btn-show-events').show();
    },

  handleImageUpload: async(event) => {
  const files = event.target.files
  const formData = new FormData()
  formData.append('myFile', files[0])

  fetch('/saveImage', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.path)
  })
  .catch(error => {
    console.error(error)
  })
},

    stopListeningToEvents: async () => {
        if(App.logSellArticleEventListener != null) {
            console.log("unsubscribe from sell events");
            await App.logSellArticleEventListener.removeAllListeners();
            App.logSellArticleEventListener = null;
        }
        if(App.logBuyArticleEventListener != null) {
            console.log("unsubscribe from buy events");
            await App.logBuyArticleEventListener.removeAllListeners();
            App.logBuyArticleEventListener = null;
        }

        $('#events')[0].className = "list-group-collapse";

        $('.btn-subscribe').show();
        $('.btn-unsubscribe').hide();
        $('.btn-show-events').hide();
    },

    sellArticle: async () => {
        //const articlePriceValue = parseFloat($('#article_price').val());
        //const articlePrice = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
        const _name = $('#article_name').val();
        const _description = $('#article_description').val();
        temp=0.01;
        articlePrice=temp.toString()
        const _price = window.web3.utils.toWei(articlePrice, "ether");
        //const _starttime="From start";
        //const _endtime="Till now";
       //console.log("Arti price")
        //console.log(articlePrice)
        //console.log("Price")
        //console.log(_price)
        const _tag = $('#article_tag').val();
        console.log(_tag)


        if(_name.trim() == "" || _price === "0") {
            return false;
        }
        try {
            const marketInstance = await App.contracts.Market.deployed();
        //    console.log(value123);
            const transactionReceipt = await marketInstance.sellArticle(
                _name,
                _description,
                _tag,
                _price,
                {from: App.account, gas: 5000000}
            ).on("transactionHash", hash => {
                console.log("transaction hash", hash);
                $('#modal-loading').attr('hidden', false)
                App.blurBackground();


              //  $('#animation-area').style.filter.blur(2px);
                //App.logBuyArticleEventListener = marketInstance.LogBuyArticle({fromBlock: '0'}).on("data", event => {

            //    })
            });
            console.log("transaction receipt" + transactionReceipt);
            $('#modal-loading').attr('hidden', true);
            $('#modal-submission').attr('hidden', false);


            App.blurBackground();



        } catch(error) {
            console.error(error);
            $('#modal-loading').attr('hidden', true);
            $('#modal-error').attr('hidden', false);
            App.blurBackground();




        }
    },

    startTime: async () => {

    },

    endTime: async () => {
      var _articleId = App.articletest
      console.log(_articleId)
      var timeB = document.getElementById('timeStart').value;
      var timeE = document.getElementById('timeEnd').value;
      time1= new Date(timeB);
      time2= new Date(timeE);
      time3= time2-time1;
      temp= time3/10000000
      const _price = temp.toString()
      //const _price = window.web3.utils.toWei(articlePrice, "ether");

      var articleTemplate = $('#modal-time');
      articleTemplate.find('.time-price').text(_price);
      //articleTemplate.find('.article-description').text(description);
      /*
      var element1 = document.getElementById(start).value;
      var element2 = document.getElementById(end).value;
      document.getElementById(start).disabled = true;
      document.getElementById(end).disabled = true;
      time1= new Date(element1);
      time2= new Date(element2);
      time3= time2-time1;
      temp= time3/10000000*/
    },

    ajaxPost: async()=>{

      // PREPARE FORM DATA
      var formData = {
        timeStart : $("#timeStart").val(),
        timeEnd :  $("#timeEnd").val()
      }

      console.log(formData)

      // DO POST
      $.ajax({
      type : "POST",
      contentType : "application/json",
      url : window.location + "sendTime",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(timetest) {console.log("Success!");
      //  $("#postResultDiv").html("<p>" +
        //  "Post Successfully! <br>" +
          //"--->" + JSON.stringify(timetest)+ "</p>");
      },
      error : function(e) {
        //alert("Error!")
        console.log("ERROR: ", e);
      }
    });

      // Reset FormData after Posting
    //  App.resetData();

    },

    resetData: async() => {
      $("#timeStart").val("");
      $("#endStart").val("");
    },

    buyArticle: async () => {
        event.preventDefault();

        document.getElementById('timeStart').disabled = true;
        document.getElementById('timeEnd').disabled = true;
        //$('#modal-time').attr('hidden', false);
        App.blurBackground();

        // retrieve the article price
        //var _articleId = $(event.target).data('id');
        var _articleId = App.articletest
        console.log(_articleId)
        //const articlePriceValue = parseFloat($(event.target).data('value'));
        //const articlePrice1 = isNaN(articlePriceValue) ? "0" : articlePriceValue.toString();
        //start='start'+ _articleId.toString();
        //end='end'+ _articleId.toString();
        //console.log(test1)

        var element1 = document.getElementById('timeStart').value;
        //console.log(typeof(element1))
        var element2 = document.getElementById('timeEnd').value;
        //console.log(typeof(element2))

        //var element3 = document.getElementById('linktest')
        time1= new Date(element1);
        time2= new Date(element2);
        time3= time2-time1;
        temp= time3/10000000
        const articlePrice = temp.toString()
        const _price = window.web3.utils.toWei(articlePrice, "ether")

        var startstamp=App.toTimestamp(time1)
        var endstamp=App.toTimestamp(time2)

        App.ajaxPost();


        //httpRequest = new XMLHttpRequest();
        //httpRequest.onreadystatechange = "Problem with request";
        //httpRequest.open('POST', 'sendTime1');
        //httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      //  httpRequest.send('Time= ' + encodeURIComponent(startstamp) + 'T= '+ encodeURIComponent(endstamp));
        //httpRequest.send('endTime= ' + encodeURIComponent(endstamp));
        //console.log(startstamp)
        //console.log(endstamp)
        //http://localhost:3000/d/5_8OLaVGk/home?editPanel=2&orgId=1&from=1599883200000&to=1600228799000
        //temp = "http://localhost:3000/d/5_8OLaVGk/home?orgId=1&from="+startstamp+"&to="+endstamp //toTimestamp('09/06/2020 17:31:30')

        //element3.href=tem
      //  document.getElementById('receiptStart1').value=element1;
      //  document.getElementById('receiptEnd1').value=element2;
      //  document.getElementById('receiptStart1').disabled=true;
      //  document.getElementById('receiptEnd1').disabled=true;

        try {
            const marketInstance = await App.contracts.Market.deployed();

           // const articleIds = await marketInstance.getArticlesForSale();
            const transactionReceipt = await marketInstance.buyArticle(
                _articleId, {
                    from: App.account,
                    value: _price,
                    gas: 500000
                }
            ).on("transactionHash", hash => {
                console.log("transaction hash", hash);
                document.getElementById("file").disabled = false;
                document.getElementById("filepost").disabled = false;
                var number = 0;
                marketInstance.LogSellArticle({fromBlock: "0"}).on("data", async function(event) {
                number++;

              //  console.log(number);
                //console.log(_articleId);
                if (number == _articleId){
                  console.log(event.returnValues);
                //  $('#modal-time').attr('hidden', true);
                  //  $('#modal-loading').attr('hidden', false);
                  //  App.blurBackground();

                } else {
                    return
                }});




            });




            //console.log("transaction receipt", transactionReceipt);
          //  $('#modal-loading').attr('hidden', true);
            //var button = document.getElementById('buttontest');
            //button.disabled = false;
            //temp = "http://localhost:3000/d/5_8OLaVGk/home?orgId=1&from="+startstamp+"&to="+endstamp
            //button.href = temp;
            //console.log(button)
          //  $('#modal-time1').attr('hidden', false);
          //  App.blurBackground();


       // console.log(marketInstance.Article.hashvalue);
        } catch(error) {
            console.error(error);
            $('#modal-loading').attr('hidden', true);
            $('#modal-error').attr('hidden', false);
            App.blurBackground();

        }



    },

    selectRange: async () => {
      event.preventDefault();
      console.log(event.target)

      $('#modal-time').attr('hidden', false);
      App.articletest = $(event.target).data('id');
      console.log(App.articletest)
    },

    reloadArticles: async () => {
        // avoid reentry
        if (App.loading) {
            return;
        }
        App.loading = true;

        // refresh account information because the balance may have changed
        App.displayAccountInfo();

        try {
            const marketInstance = await App.contracts.Market.deployed();
            const articleIds = await marketInstance.getArticlesForSale();
            $('#articlesRow').empty();
            for(let i = 0; i < articleIds.length; i++) {
                const article = await marketInstance.articles(articleIds[i]);
                App.displayArticle(article[0], article[1], article[3], article[4], article[5]);
            }
            App.loading = false;
        } catch(error) {
            console.error(error);
            App.loading = false;
        }
    },

    toTimestamp: (strDate) => {
     var datum = Date.parse(strDate);
     return datum;
   },


    displayArticle: (id, seller, name, description, price, tag) => {
        // Retrieve the article placeholder
        const articlesRow = $('#articlesRow');
        const etherPrice = web3.utils.fromWei(price, "ether");
        console.log(id.words)
        console.log(price)
        console.log(tag)
        console.log(name)
        //test2=id.words[0]
        //test='start'+ id.words[0].toString();
        //test1='end'+id.words[0].toString();
        //test2='testid'+id.words[0].toString();
        // Retrieve and fill the article template
        var articleTemplate = $('#articleTemplate');
        articleTemplate.find('.panel-title').text(" " + name);
        articleTemplate.find('.article-description').text(description);
        articleTemplate.find('.article-tag').text(id.words[0]);
        //articleTemplate.find('.article-price').text(etherPrice);
        articleTemplate.find('.btn-buy').attr('data-id', id);
        articleTemplate.find('.btn-buy').attr('data-value', etherPrice);
        //articleTemplate.find('.article-start').Id(test);
        //articleTemplate.find('.article-start').id(test1);

        // seller?
        if (seller == App.account) {
            articleTemplate.find('.article-seller').text("You");
            articleTemplate.find('.btn-buy').hide();
        } else {
            articleTemplate.find('.article-seller').text(seller);
            articleTemplate.find('.btn-buy').show();
        }

        // add this new article
        articlesRow.append(articleTemplate.html());
        //document.getElementById('start').id=test;
        //document.getElementById('end').id=test1;
        //document.getElementById('testid').id=test2;
    },

    CloseReceipt: async () => {
        $('#modal-receipt').attr('hidden', true);
        //console.log('hello');
        App.unblurBackground();


    },

    CloseSubmission: async () => {
        $('#modal-submission').attr('hidden', true);
        console.log('closed submission');
        App.unblurBackground();


    },


    CloseWindow: async () => {
        $('#modal-loading').attr('hidden', true);
        console.log('hello');
        App.unblurBackground();


    },

    CloseTimeWindow: async () => {
        $('#modal-time').attr('hidden', true);
        console.log('hello');
        App.unblurBackground();


    },



    CloseError: async () => {
        $('#modal-error').attr('hidden', true);
        console.log('hello');
        App.unblurBackground();


    },

    blurBackground: async () => {
        var background = document.getElementById("animation-area");
        background.setAttribute("style", "filter: blur(4px) brightness(.5);");
    },

    unblurBackground: async () => {
        var background = document.getElementById("animation-area");
        background.setAttribute("style", "filter: blur(0px) brightness(1);");
    },

};




$(function () {
    $(window).load(function () {
        App.init();
    });
});
