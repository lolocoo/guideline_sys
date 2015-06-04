requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery: 'jquery-1.11.3.min',
        tpl:'../tpl'
    }
});

requirejs([
    'jquery', 
    'underscore', 
    'backbone', 
    'text!tpl/menu.html',
    'text!tpl/page_header.html'
    ], 
    function($, _, Backbone, tpl_menu, tpl_page_header){
    
        $(function(){
        // app function start
        var app = app || {};

        // Data
        app.data = {
            menu: {
                'color': {
                    'title': '色彩',
                    'sub':['one', 'two', 'three', 'four']
                },
                'text': {
                    'title': '文字',
                    'sub':['one', 'two', 'three', 'four']
                },
                'icon': {
                    'title': '图标',
                    'sub':['平台图标', '应用图标', 'three', 'four']
                }
            }
        };

        // Model 
        app.PageData = Backbone.Model.extend({
            defaults: {
                title: '色彩',
                subtitle: 'one',
                tag: 'color',
                tab: 'ue',
                index: 0
            },
            getUrl: function(){
                if(!this.tag){
                    return 'docs/'+this.get('tag')+'_'+this.get('index')+'_'+this.get('tab')+'.html';
                }
            }
        });

        app.pageData = new app.PageData;
        console.log(app.pageData.getUrl());

        // View
        app.Navigation = Backbone.View.extend({
            el: $("#mainNav > ul"),
            
            tagName: 'li',

            initialize: function(){
                this.render();
                this.listenTo(app.pageData, 'change', this.render);
            },

            tpl: _.template(tpl_menu),
            render: function(){
                var temp_data = _.extend({pagedata:app.pageData.toJSON()}, app.data.menu);
                this.$el.html(this.tpl({menudata: temp_data}));
            }
        });

        app.PageHeader = Backbone.View.extend({
            el: $('#pageHeader'),
            tpl: _.template(tpl_page_header),
            events: {
                'click li': 'tab'
            },
            initialize: function(){
                this.listenTo(app.pageData, 'change', this.render);
                this.render();
            },
            tab: function(e){
                var $lis = this.$('li', this.el);
                $lis.removeClass('is-select');
                $(e.target).parent().addClass('is-select')
            },
            render: function(){
                $(this.el).html(this.tpl(app.pageData.toJSON()));
            }
        });

        app.DocPage = Backbone.View.extend({
            el: $('#docPage'),
            initialize: function(){
                this.model = app.pageData;
                this.listenTo(this.model, 'change', this.render);
                // this.render();
            },
            render: function(){
                $(this.el).html('Loading...');
                $(this.el).load(this.model.getUrl());
            }
        });

        app.navigation = new app.Navigation;
        app.pageheader = new app.PageHeader;
        app.docpage = new app.DocPage;

        // Router
        app.AppRouter = Backbone.Router.extend({
            routes: {
                'help': 'help',
                ':route/:index': 'loadView',
                ':route/:index/:tab': 'setTab',
                "*actions": "defaultRoute" // matches http://example.com/#anything-here
            },

            initialize: function(){

            },

            help: function(){
                console.log('help');
            },

            loadView: function(route, index){
                console.log(route + "_" + index);
                app.pageData.set({
                    title: app.data.menu[route]['title'],
                    subtitle: app.data.menu[route]['sub'][index],
                    tag: route,
                    index: index,
                    tab: 'ue'
                });
                console.log(app.pageData.toJSON());
            },

            setTab: function(route, index, pos){
                console.log(route, index, pos);
                console.log(app.data.menu[route]['sub'][index]);
                app.pageData.set({
                    title: app.data.menu[route]['title'],
                    subtitle: app.data.menu[route]['sub'][index],
                    index: index,
                    tag: route,
                    tab: pos
                });
            },

            defaultRoute: function(actions){
                if(!_.has(app.data.menu, actions)) return;
                app.pageData.set({
                    title: app.data.menu[actions]['title'],
                    subtitle: '',
                    index: 0,
                    tag: actions,
                    tab: 'ue'
                });
            }
        });

        var approuter = new app.AppRouter;
        Backbone.history.start();

        // $('#docPage').load('docs/color_0_fe.html');
        // end app function
        });

    
});

