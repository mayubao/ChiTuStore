﻿/// <reference path="../../../Scripts/typings/require.d.ts"/>
/// <reference path="../../../Scripts/typings/knockout.d.ts"/>
/// <reference path="../../../Scripts/typings/hammer.d.ts"/>
/// <reference path="../../../Scripts/typings/move.d.ts"/>

import ko = require('knockout');
import app = require('Application');
import services = require('Services/Service');
import home = require('Services/Home');
//import Carousel = require('Core/Carousel');

export = function(page: chitu.Page) {

    var homeProductQueryArguments = {
        pageIndex: 0
    }

    var model = {
        name: ko.observable(''),
        brands: ko.observableArray(),
        advertItems: ko.observableArray(),
        homeProducts: ko.observableArray(),
    };

    function page_load(sender: chitu.Page, args: chitu.PageLoadArguments) {
        if (args.loadType == chitu.PageLoadType.init) {
            home.advertItems().done(function(advertItems) {
                for (var i = 0; i < advertItems.length; i++) {
                    advertItems[i].index = i;
                    advertItems[i].LinkUrl = advertItems[i].LinkUrl;
                    model.advertItems.push(advertItems[i]);
                }
            });
        }

        var result = home.homeProducts(homeProductQueryArguments.pageIndex)
            .done(function(homeProducts: Array<any>) {
                for (var i = 0; i < homeProducts.length; i++) {
                    homeProducts[i].Url = '#Home_Product_' + homeProducts[i].ProductId;
                    model.homeProducts.push(homeProducts[i]);
                }

                homeProductQueryArguments.pageIndex++;
                args.enableScrollLoad = (homeProducts.length == services.defaultPageSize);
            });

        return result;
    }

    function page_loadCompleted(sender: chitu.Page, args: chitu.PageLoadArguments) {
        if (args.loadType != chitu.PageLoadType.init)
            return;

        requirejs(['Core/Carousel'], function(Carousel: any) {
            var c = new Carousel($(sender.node).find('[name="ad-swiper"]')[0]);
        })
    }

    function page_viewChange(sender: chitu.Page) {
        ko.applyBindings(model, sender.node);
    }

    var viewDeferred = page.view;
    page.view = $.when(viewDeferred, chitu.Utility.loadjs(['UI/PromotionLabel', 'css!sc/Home/Index']));

    page.viewChanged.add(page_viewChange);
    page.load.add(page_load);
    page.loadCompleted.add(page_loadCompleted);
}


// class MySwpier {
//     private container: HTMLElement;
//     private wrapper: HTMLElement;
//     private sliders: Array<any>;
//     private current_index: number = 0;
//     private deltaX: number = 0;
//     private timeIntervalId: number;
// 
//     constructor(element: HTMLElement) {
//         this.container = element;
//         this.wrapper = $(element).find('.swiper-wrapper')[0];
//         this.sliders = $(element).find('.swiper-slide').map(function(index, element: HTMLElement) {
//             $(element).width($(window).width());
//             return {
//                 element: element,
//                 active: function() {
//                     //this.element
//                 }
//             };
//         }).toArray();
//     }
// 
//     start() {
//         if (this.isFirst && this.isLastest) {
//             return;
//         }
// 
//         var positive = true;//正向移动
//         this.timeIntervalId = window.setInterval(() => {
//             if (positive)
//                 this.next();
//             else
//                 this.previous();
// 
//             if (this.isLastest)
//                 positive = false;
// 
//             if (this.isFirst)
//                 positive = true
// 
//         }, 1000);
//     }
// 
//     stop() {
//         console.log('stop');
//         clearInterval(this.timeIntervalId);
//     }
// 
//     get isLastest() {
//         return this.current_index >= this.sliders.length - 1;
//     }
// 
//     get isFirst() {
//         return this.current_index <= 0;
//     }
// 
//     next() {
//         if (this.isLastest)
//             return;
// 
//         var deltaX = $(this.sliders[this.current_index].element).width();
//         this.deltaX = this.deltaX - deltaX;
//         this.wrapper.style.transform = this.wrapper.style.webkitTransform
//             = 'translateX(' + this.deltaX + 'px)';
//         this.wrapper.style.webkitTransitionDuration = this.wrapper.style.transitionDuration = '0.3s';
//         this.current_index = this.current_index + 1;
//     }
// 
//     previous() {
//         if (this.isFirst)
//             return;
// 
//         var deltaX = $(this.sliders[this.current_index].element).width();
//         this.deltaX = this.deltaX + deltaX;
//         this.wrapper.style.transform = this.wrapper.style.webkitTransform
//             = 'translateX(' + this.deltaX + 'px)';
//         this.wrapper.style.webkitTransitionDuration = this.wrapper.style.transitionDuration = '0.3s';
//         this.current_index = this.current_index - 1;
//     }
// }
