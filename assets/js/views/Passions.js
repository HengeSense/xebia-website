define(['text!/assets/tmpl/passions.html',
    'jquery.parallax',
    'slides'],
    function (source) {
    return Backbone.View.extend({
    	el: '#passions > .content',
    	template: Handlebars.compile(source),
        slides: [
            [
                { src: 'assets/img/passions/keywords_cat1_derriere.png', width: 978, height: 540 },
                { src: 'assets/img/passions/keywords_cat1_milieu.png', width: 1069, height: 622 },
                { src: 'assets/img/passions/keywords_cat1_devant.png', width: 949, height: 408 }
            ], [
                { src: 'assets/img/passions/keywords_cat2_derriere.png', width: 663, height: 318 },
                { src: 'assets/img/passions/keywords_cat2_milieu.png', width: 933, height: 547 },
                { src: 'assets/img/passions/keywords_cat2_devant.png', width: 631, height: 546 }
            ], [
                { src: 'assets/img/passions/keywords_cat3_derriere.png', width: 1111, height: 670 },
                { src: 'assets/img/passions/keywords_cat3_milieu.png', width: 1103, height: 584 },
                { src: 'assets/img/passions/keywords_cat3_devant.png', width: 902, height: 649 }
            ], [
                { src: 'assets/img/passions/keywords_cat4_derriere.png', width: 1046, height: 425 },
                { src: 'assets/img/passions/keywords_cat4_milieu.png', width: 907, height: 434 },
                { src: 'assets/img/passions/keywords_cat4_devant.png', width: 587, height: 530 }
            ],
            [
                { src: 'assets/img/passions/keywords_cat5_derriere.png', width: 751, height: 580 },
                { src: 'assets/img/passions/keywords_cat5_milieu.png', width: 1084, height: 602 },
                { src: 'assets/img/passions/keywords_cat5_devant.png', width: 799, height: 500 }
            ]
        ],
        tableau: {
            width: 1114,
            height: 627
        },
    	initialize: function() {
            $(this.template()).appendTo(this.$el).hide().fadeIn().slideDown();
            this.$slidesWrapper = $('#slides-wrapper');
            this.$slides = $('.slides_container');

            var that = this;
            $.each(this.slides, function (indexSlide) {
                that.addSlide(this, indexSlide);
            });

            // Parallax
            for(var i=0; i<this.slides.length; i++) {
                this.$('#cat' + i + ' .parallax-layer').parallax({
                    mouseport: jQuery('#cat' + i)
                });
            }

            // Slides
            this.$slidesWrapper.slides({
                prev: 'prev',
                next: 'next'
            });
    	},
        render: function() {
            this.centerElements();
            $(window).bind('resize', _.bind(this.centerElements, this));
        },
        centerElements: function() {
            this.$slidesWrapper.css({
                left : ($(window).width() - this.tableau.width)/2,
                top : ($(window).height() - this.tableau.height)/2
            });
        },
        addSlide: function(slide, indexSlide) {
            this.$slides.append('<div class="blackboard"><div class="parallax-viewport" id="cat' + indexSlide +'"></div></div>');

            var that = this;
            $.each(slide, function () {
                that.addParallaxLayer(this, indexSlide);
            });
        },
        addParallaxLayer: function(layer, indexSlide) {
            var divCode = '<div class="parallax-layer" style="width:' + layer.width + 'px; height:' + layer.height + 'px;">'
                        + '<img src="' + layer.src + '" alt="" style="top:' + (this.tableau.height - layer.height)/2 + 'px; left:' + (this.tableau.width - layer.width)/2 + 'px;" />'
                        + '</div>';
            $('#cat' + indexSlide).append(divCode);
        }
    });
});