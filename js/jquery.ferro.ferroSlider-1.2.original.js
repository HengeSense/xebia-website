/*
 Ferro Slider version 1.2
 Requires jQuery (tested on 1.6.1, but no new features used).
 Requires (optional) jQuery easing (tested on 1.3, but no new features used).

 Copyright 2012 Ferro

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
(function($) {
	var methods = {
		ferroSliderDesktop : function(options) {
			function triggerEvent(a, b, c) {
				$.event.moveTo = c;
				$.event.moveFrom = b;
				$(elementToTrigger).trigger(a)
			}

			function shiftAllButFirst(a, b) {
				for ( i = 1; i < matrixOrder.length; i++) {
					var c = "slidingSpacesOuterDiv_" + matrixOrder[i].id;
					if (b != null) {
						$("#" + c).offset({
							top : b + displayHeight * matrixOrder[i].row
						})
					}
					if (opts.fullScreenBackground) {
						scaleBackground($("#" + matrixOrder[i].id + " ." + opts.backGroundImageClass))
					}
				}
			}

			function setMagicNumbers() {
				if (opts.container == "none") {
					if (isMobile) {
						if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1) {
							if (window.orientation == 0 || window.orientation == 180) {
								var a = screen.width * window.devicePixelRatio;
								var b = (screen.height - 64) * window.devicePixelRatio
							} else {
								var b = (screen.width - 49) * window.devicePixelRatio;
								var a = screen.height * window.devicePixelRatio
							}
						} else {
							var b = window.outerHeight / window.devicePixelRatio;
							var a = window.outerWidth / window.devicePixelRatio
						}
						displayHeight = Math.round(b);
						displayWidth = Math.round(a)
					} else {
						displayWidth = $(window).width();
						displayHeight = $(window).height()
					}
					offsetX = 0;
					offsetY = 0;
					elementToScroll = "html,body"
				} else {
					if (isMobile) {
						var b = $(opts.container).outerHeight(true);
						var a = $(opts.container).outerWidth(true);
						var c = window.devicePixelRatio;
						displayHeight = Math.round(b);
						displayWidth = Math.round(a);
						offsetX = $(opts.container).offset().left;
						offsetY = $(opts.container).offset().top;
						elementToScroll = opts.container
					} else {
						displayWidth = $(opts.container).outerWidth(true);
						displayHeight = $(opts.container).outerHeight(true);
						offsetX = $(opts.container).offset().left;
						offsetY = $(opts.container).offset().top;
						elementToScroll = opts.container
					}
				}
			}

			function setFullScreenBackground(a) {
				var b = $("#" + a.id + " ." + opts.backGroundImageClass);
				var c = 0;
				var d = 0;
				$(b).load(function() {
					scaleBackground($(this))
				}).error(function() {
					$(this).remove()
				})
			}

			function scaleBackground(a) {
				w = a.width();
				h = a.height();
				var b = h / w;
				if (displayHeight / displayWidth > b) {
					a.height(displayHeight);
					a.width(displayHeight / b)
				} else {
					a.width(displayWidth);
					a.height(displayWidth * b)
				}
				zIndex += zIndexDecrement;
				zIndexDecrement--;
				a.css("position", "absolute");
				a.css("float", "left");
				a.css("z-index", zIndex);
				a.css("left", (displayWidth - a.width()) / 2);
				a.css("top", (displayHeight - a.height()) / 2)
			}

			function revalidate() {
				var a = displayWidth;
				var b = displayHeight;
				setMagicNumbers();
				refreshPosition(a, b);
				if (opts.createMap) {
					positionMap()
				}
				if (opts.createSensibleAreas) {
					positionSensibleAreas()
				}
				if (opts.createPlayer && opts.autoSlide) {
					positionPlayer()
				} else if (opts.createTimeBar) {
					positionPlayer()
				}
			}

			function refreshTimerBar(a) {
				$("#slidingSpacesPlayerTimerIn").stop();
				if (play) {
					$("#slidingSpacesPlayerTimerIn").animate({
						width : "100%"
					}, a, "linear")
				}
			}

			function refreshPositionMobile(a, b) {
				zIndex = -1e3;
				var c = findElementByPosition(actualRow, actualCol);
				for ( i = 0; i < matrixOrder.length; i++) {
					var d = matrixOrder[i].column * displayWidth;
					var e = matrixOrder[i].row * displayHeight;
					var f = matrixOrder[i].id;
					var g = "slidingSpacesOuterDiv_" + f;
					$("#" + g).width(displayWidth);
					$("#" + g).height(displayHeight);
					if (e > 0) {
						var h = e;
						if (elementToScroll != "html,body") {
							h += $(elementToScroll).offset().top
						}
						$("#" + g).offset({
							top : h
						})
					}
					if (d > 0) {
						var j = d;
						if (elementToScroll != "html,body") {
							j += $(elementToScroll).offset().left
						}
						$("#" + g).offset({
							left : j
						})
					}
					if (opts.fullScreenBackground) {
						scaleBackground($("#" + matrixOrder[i].id + " ." + opts.backGroundImageClass))
					}
				}
				$("#slidingSpacesNavigationFeedback").width(displayWidth);
				$("#slidingSpacesNavigationFeedback").height(displayHeight);
				if (c.id != null) {
					var k = findElementById(c.id);
					window.scrollTo(k.column * displayWidth, k.row * displayHeight);
					actualOffsetX = k.column * displayWidth;
					actualOffsetY = k.row * displayHeight
				}
			}

			function refreshPosition(a, b) {
				zIndex = -1e3;
				var c = findElementByOffset(a, b);
				for ( i = 0; i < matrixOrder.length; i++) {
					var d = matrixOrder[i].column * displayWidth;
					var e = matrixOrder[i].row * displayHeight;
					var f = matrixOrder[i].id;
					var g = "slidingSpacesOuterDiv_" + f;
					$("#" + g).stop();
					$("#" + g).width(displayWidth);
					$("#" + g).height(displayHeight);
					if (e > 0) {
						var h = e + (displayHeight - b) * matrixOrder[i].row;
						if (elementToScroll != "html,body") {
							h = $("#" + g).offset().top + (displayHeight - b) * matrixOrder[i].row
						}
						$("#" + g).animate({
							top : h
						}, 100, "linear")
					}
					if (d > 0) {
						var j = d + (displayWidth - a) * matrixOrder[i].column;
						if (elementToScroll != "html,body") {
							j = $("#" + g).offset().left + (displayWidth - a) * matrixOrder[i].column
						}
						$("#" + g).offset({
							left : j
						})
					}
					if (opts.fullScreenBackground) {
						scaleBackground($("#" + matrixOrder[i].id + " ." + opts.backGroundImageClass))
					}
				}
				$("#slidingSpacesNavigationFeedback").width(displayWidth);
				$("#slidingSpacesNavigationFeedback").height(displayHeight);
				if (c.id != null) {
					var k = findElementById(c.id);
					$(elementToScroll).animate({
						scrollTop : k.row * displayHeight,
						scrollLeft : k.column * displayWidth
					}, 0);
					actualOffsetX = k.column * displayWidth;
					actualOffsetY = k.row * displayHeight
				}
			}

			function refreshMap(a) {
				$("#slidingSpacesNavigationMap a").each(function(b) {
					$dot = $(this);
					var c = "";
					if ( typeof $dot.attr("id") != "undefined") {
						c = $dot.attr("id").split("_")
					}
					if (c.length == 2) {
						if (c[1] == a) {
							$dot.attr("class", "slidingSpacesNavigationDotActual");
							$dot.attr("href", "")
						} else {
							$dot.attr("class", "slidingSpacesNavigationDot");
							$dot.attr("href", "#" + c[1])
						}
					}
				});
				$(".slidingSpacesNavigationDot").each(function(a) {
					var b = $(this);
					b.unbind("click");
					b.unbind("touchstart");
					b.bind("touchstart", function(a) {
						clickEvent(a, $el)
					});
					if (!isMobile) {
						b.bind("click", function(a) {
							clickEvent(a, b)
						})
					} else {
						b.removeAttr("href")
					}
				});
				$(".slidingSpacesNavigationDotActual").each(function(a) {
					var b = $(this);
					b.unbind("click");
					b.unbind("touchstart");
					b.removeAttr("href")
				})
			}

			function positionSensibleAreas() {
				if (elementToScroll != "html,body") {
					$("#slidingSpacesSensibleArea_up").width($(elementToScroll).width());
					$("#slidingSpacesSensibleArea_up").offset({
						top : $(elementToScroll).offset().top + eval($(elementToScroll).css("border-top-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_right").height($(elementToScroll).height());
					$("#slidingSpacesSensibleArea_right").offset({
						left : $(elementToScroll).width() + $(elementToScroll).offset().left - $("#slidingSpacesSensibleArea_right").width() + eval($(elementToScroll).css("border-right-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_down").width($(elementToScroll).width());
					$("#slidingSpacesSensibleArea_down").offset({
						top : $(elementToScroll).height() + $(elementToScroll).offset().top - $("#slidingSpacesSensibleArea_down").height() + eval($(elementToScroll).css("border-bottom-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_left").height($(elementToScroll).height());
					$("#slidingSpacesSensibleArea_left").offset({
						left : $(elementToScroll).offset().left + eval($(elementToScroll).css("border-left-width").replace("px", ""))
					})
				}
			}

			function positionPlayer() {
				$("#slidingSpacesPlayer").css("z-index", 100);
				var playerWidth = $("#slidingSpacesPlayer").outerWidth(true);
				var playerHeight = $("#slidingSpacesPlayer").outerHeight(true);
				var mapHeight = 0;
				var mapWidth = 0;
				var playerTop = 0;
				var playerLeft = 0;
				var elementToScrollTop = 0;
				var elementToScrollLeft = 0;
				var elementToScrollBottom = $(elementToScroll).height();
				var elementToScrollRight = $(elementToScroll).width();
				var borderTop = 0;
				var borderRight = 0;
				var borderBottom = 0;
				var borderLeft = 0;
				var timeBarHeight = $("#slidingSpacesPlayerTimerOut").outerHeight(true);
				if (opts.container != "none") {
					var elementToScrollTop = $(elementToScroll).offset().top;
					var elementToScrollLeft = $(elementToScroll).offset().left;
					var elementToScrollBottom = $(elementToScroll).height();
					var elementToScrollRight = $(elementToScroll).width();
					borderTop = eval($(elementToScroll).css("border-top-width").replace("px", ""));
					borderRight = eval($(elementToScroll).css("border-right-width").replace("px", ""));
					borderBottom = eval($(elementToScroll).css("border-bottom-width").replace("px", ""));
					borderLeft = eval($(elementToScroll).css("border-left-width").replace("px", ""))
				}
				if (opts.createPlayer && opts.playerPosition == "bottom_center") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
					playerLeft = elementToScrollLeft + (displayWidth / 2 - playerWidth / 2)
				} else if (opts.createPlayer && opts.playerPosition == "bottom_left") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
					playerLeft = elementToScrollLeft + 0 + borderLeft
				} else if (opts.createPlayer && opts.playerPosition == "bottom_right") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
					playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
					playerLeft = elementToScrollRight - playerWidth - borderRight
				} else if (opts.createPlayer && opts.playerPosition == "top_center") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					playerTop = elementToScrollTop + mapHeight + 10 + borderTop;
					playerLeft = elementToScrollLeft + (displayWidth / 2 - playerWidth / 2)
				} else if (opts.createPlayer && opts.playerPosition == "top_left") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					playerTop = elementToScrollTop + mapHeight + 10 + borderTop;
					playerLeft = elementToScrollLeft + 0 + borderLeft
				} else if (opts.createPlayer && opts.playerPosition == "top_right") {
					mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
					playerTop = elementToScrollTop + mapHeight + 10 + borderTop;
					playerLeft = elementToScrollRight - playerWidth - borderRight
				}
				$("#slidingSpacesPlayer").css({
					top : playerTop,
					left : playerLeft
				})
			}

			function positionMap() {
				$("#slidingSpacesNavigationMap").css("z-index", 1e3);
				var mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
				var mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
				var mapInnerX = mapWidth - $("#slidingSpacesNavigationMap").width();
				var mapInnerY = mapHeight - $("#slidingSpacesNavigationMap").height();
				var elementToScrollTop = 0;
				var elementToScrollLeft = 0;
				var borderTop = 0;
				var borderRight = 0;
				var borderBottom = 0;
				var borderLeft = 0;
				if (opts.container != "none") {
					elementToScrollTop = $(elementToScroll).offset().top;
					elementToScrollLeft = $(elementToScroll).offset().left;
					borderTop = eval($(elementToScroll).css("border-top-width").replace("px", ""));
					borderRight = eval($(elementToScroll).css("border-right-width").replace("px", ""));
					borderBottom = eval($(elementToScroll).css("border-bottom-width").replace("px", ""));
					borderLeft = eval($(elementToScroll).css("border-left-width").replace("px", ""))
				}
				if (opts.mapPosition.toLowerCase() == "top_left") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + borderTop,
						left : elementToScrollLeft + borderLeft
					})
				} else if (opts.mapPosition.toLowerCase() == "top_center") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + borderTop,
						left : elementToScrollLeft + (displayWidth / 2 - mapWidth / 2)
					})
				} else if (opts.mapPosition.toLowerCase() == "top_right") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + borderTop,
						left : elementToScrollLeft + (displayWidth - mapWidth) - borderRight
					})
				} else if (opts.mapPosition.toLowerCase() == "center_right") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + (displayHeight / 2 - mapHeight / 2),
						left : elementToScrollLeft + (displayWidth - mapWidth) - borderRight
					})
				} else if (opts.mapPosition.toLowerCase() == "bottom_center") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + displayHeight - mapHeight - borderBottom,
						left : elementToScrollLeft + (displayWidth / 2 - mapWidth / 2)
					})
				} else if (opts.mapPosition.toLowerCase() == "bottom_left") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + displayHeight - mapHeight - borderBottom,
						left : elementToScrollLeft + borderLeft
					})
				} else if (opts.mapPosition.toLowerCase() == "center_left") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + (displayHeight / 2 - mapHeight / 2),
						left : elementToScrollLeft + borderLeft
					})
				} else if (opts.mapPosition.toLowerCase() == "center_center") {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + (displayHeight / 2 - mapHeight / 2),
						left : elementToScrollLeft + (displayWidth / 2 - mapWidth / 2)
					})
				} else {
					$("#slidingSpacesNavigationMap").css({
						top : elementToScrollTop + displayHeight - mapHeight - borderBottom,
						left : elementToScrollLeft + displayWidth - mapWidth - borderRight
					})
				}
				$("#slidingSpacesNavigationMap").width(mapWidth - mapInnerX);
				$("#slidingSpacesNavigationMap").height(mapHeight - mapInnerY)
			}

			function preloadBackgroundImages() {
				var a = [];
				$(" ." + opts.backGroundImageClass).each(function() {
					var b = $(this);
					var c = document.createElement("img");
					c.src = b.attr("src");
					a.push(c)
				})
			}

			function placeElements() {
				if (elementToScroll == "html,body") {
					var a = "body";
					elementToTrigger = "body"
				} else {
					var a = elementToScroll;
					elementToTrigger = elementToScroll
				}
				for (var b = 0; b < matrixOrder.length; b++) {
					elId = matrixOrder[b].id;
					var c = "slidingSpacesOuterDiv_" + elId;
					$(a).append("<div id='" + c + "' class='slidingSpacesOuterDiv' data-role='content'></div>");
					$("#" + c).css("position", "absolute");
					$("#" + c).css("overflow", "hidden");
					$("#" + c).width(displayWidth);
					$("#" + c).height(displayHeight);
					$("#" + elId).appendTo("#" + c);
					$("#" + c).offset({
						top : matrixOrder[b].row * displayHeight + offsetY,
						left : matrixOrder[b].column * displayWidth + offsetX
					});
					if (opts.fullScreenBackground) {
						if (opts.preloadBackgroundImages) {
						}
						setFullScreenBackground(matrixOrder[b])
					}
					if (b == 0 && matrixOrder[b].ajaxLoading) {
						loadContent(matrixOrder[b])
					}
				}
			}

			function onTouchStart(a) {
				if (!$(a.target).is("input, textarea, a, select, button, img")) {
					a.preventDefault();
					a.stopPropagation();
					if (a.touches.length == 1) {
						scrollTimeStart = (new Date).getTime();
						scrollStartX = a.touches[0].pageX;
						scrollStartY = a.touches[0].pageY;
						isMoving = true;
						document.addEventListener("touchmove", onTouchMove, false)
					}
				} else {
					document.addEventListener("touchmove", function(a) {
						a.preventDefault()
					}, false)
				}
			}

			function onTouchMove(a) {
				if (isMoving) {
					var b = a.touches[0].pageX, c = scrollStartX - b, d = a.touches[0].pageY, e = scrollStartY - d;
					var f = (new Date).getTime();
					var g = null;
					var h = false;
					if (a.touches[0].target.id == "") {
						a.touches[0].target.id = "internal_" + internalCounter++
					}
					var i = a.touches[0].target.id;
					getParentContainerId(i);
					if (Math.abs(c) > Math.abs(e) && Math.abs(c) >= min_move_x) {
						if (c >= 0) {
							g = "right";
							if ($("#" + parentId).width() > displayWidth) {
								if ($("#" + parentId).scrollLeft() >= $("#" + parentId).width()) {
									h = true
								} else {
									h = false
								}
							} else {
								h = true
							}
						} else {
							g = "left";
							if ($("#" + parentId).width() > displayWidth) {
								if ($("#" + parentId).scrollLeft() <= 0) {
									h = true
								} else {
									h = false
								}
							} else {
								h = true
							}
						}
					} else if (Math.abs(c) <= Math.abs(e) && Math.abs(e) >= min_move_y) {
						if (e >= 0) {
							g = "down";
							if ($("#" + parentId).height() > displayHeight) {
								if ($("#" + parentId).scrollTop() >= $("#" + parentId).height()) {
									h = true
								} else {
									h = false
								}
							} else {
								h = true
							}
						} else {
							g = "up";
							if ($("#" + parentId).height() > displayHeight) {
								if ($("#" + parentId).scrollTop() <= 0) {
									h = true
								} else {
									h = false
								}
							} else {
								h = true
							}
						}
					}
					if (h) {
						var j = (new Date).getTime();
						for (var k = 0; k < 1e7; k++) {
							if ((new Date).getTime() - j > 100) {
								break
							}
						}
						cancelTouch();
						$(elementToScroll).stop();
						var l = findElementByOffset(displayWidth, displayHeight);
						var m = l.column;
						var n = l.row;
						if (g == "right") {
							m++
						} else if (g == "left") {
							m--
						} else if (g == "up") {
							n--
						} else if (g == "down") {
							n++
						}
						var o = findElementByPosition(n, m);
						destroyEvent("startslide");
						triggerEvent("startslide", actualElementObject, o);
						var p = o.column * displayWidth;
						var q = o.row * displayHeight;
						if (o.id != null) {
							loadContent(o);
							if (g == "left" || g == "right") {
								$(elementToScroll).animate({
									scrollLeft : p
								}, opts.time, opts.easing, function() {
									if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
										window.scrollTo(p, q)
									}
									a.preventDefault();
									a.stopPropagation();
									return false
								})
							} else {
								$(elementToScroll).animate({
									scrollTop : q
								}, opts.time, opts.easing, function() {
									if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
										window.scrollTo(p, q)
									}
									a.preventDefault();
									a.stopPropagation();
									return false
								})
							}
							refreshMap(o.id);
							destroyEvent("endslide");
							triggerEvent("endslide", actualElementObject, o);
							actualElementObject = o;
							actualCol = o.column;
							actualRow = o.row;
							actualOffsetX = p;
							actualOffsetY = q;
							window.location.hash = "#!" + o.id;
							var j = (new Date).getTime();
							for (var k = 0; k < 1e7; k++) {
								if ((new Date).getTime() - j > 100) {
									break
								}
							}
						}
					} else {
						var j = (new Date).getTime();
						for (var k = 0; k < 1e7; k++) {
							if ((new Date).getTime() - j > 100) {
								break
							}
						}
						$("#" + parentId).stop();
						if (g == "up" || g == "down") {
							distance = $("#" + parentId).scrollTop() + e;
							$("#" + parentId).animate({
								scrollTop : distance
							}, f - scrollTimeStart)
						} else {
							distance = $("#" + parentId).scrollLeft() + c;
							$("#" + parentId).animate({
								scrollLeft : distance
							}, f - scrollTimeStart)
						}
					}
				}
			}

			function loadContent(a) {
				if (a.ajaxLoading && !a.loadedContent) {
					$("#slidingSpacesNavigationFeedback").stop();
					$("#slidingSpacesNavigationFeedback").css({
						backgroundColor : "#000000",
						backgroundImage : "url(img/throbber.gif)",
						backgroundRepeat : "no-repeat",
						backgroundPosition : "center center",
						opacity : "0.7",
						"z-index" : 1e3
					});
					$("#slidingSpacesNavigationFeedback").show();
					$.ajax({
						url : opts.ajaxScript,
						data : "id=" + a.id,
						success : function(b) {
							a.loadedContent = true;
							$("#" + a.id).html("");
							$("#" + a.id).append(b);
							$("#slidingSpacesNavigationFeedback").css({
								opacity : "0",
								backgroundColor : "transparent",
								"z-index" : "-100"
							})
						},
						error : function(a) {
						}
					})
				}
			}

			function isMobile() {
				if (navigator.userAgent.toLowerCase().indexOf("android") > -1 || navigator.userAgent.toLowerCase().indexOf("blackberry9500") > -1 || navigator.userAgent.toLowerCase().indexOf("blackberry9530") > -1 || navigator.userAgent.toLowerCase().indexOf("cupcake") > -1 || navigator.userAgent.toLowerCase().indexOf("dream") > -1 || navigator.userAgent.toLowerCase().indexOf("incognito") > -1 || navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipod") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1 || navigator.userAgent.toLowerCase().indexOf("mini") > -1 || navigator.userAgent.toLowerCase().indexOf("webos") > -1 || navigator.userAgent.toLowerCase().indexOf("webmate") > -1 || navigator.userAgent.toLowerCase().indexOf("2.0 mmp") > -1 || navigator.userAgent.toLowerCase().indexOf("240×320") > -1 || navigator.userAgent.toLowerCase().indexOf("asus") > -1 || navigator.userAgent.toLowerCase().indexOf("au-mic") > -1 || navigator.userAgent.toLowerCase().indexOf("alcatel") > -1 || navigator.userAgent.toLowerCase().indexOf("amoi") > -1 || navigator.userAgent.toLowerCase().indexOf("audiovox") > -1 || navigator.userAgent.toLowerCase().indexOf("avantgo") > -1 || navigator.userAgent.toLowerCase().indexOf("benq") > -1 || navigator.userAgent.toLowerCase().indexOf("bird") > -1 || navigator.userAgent.toLowerCase().indexOf("blackberry") > -1 || navigator.userAgent.toLowerCase().indexOf("blazer") > -1 || navigator.userAgent.toLowerCase().indexOf("cdm") > -1 || navigator.userAgent.toLowerCase().indexOf("cellphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ddipocket") > -1 || navigator.userAgent.toLowerCase().indexOf("danger") > -1 || navigator.userAgent.toLowerCase().indexOf("docomo") > -1 || navigator.userAgent.toLowerCase().indexOf("elaine/3.0") > -1 || navigator.userAgent.toLowerCase().indexOf("ericsson") > -1 || navigator.userAgent.toLowerCase().indexOf("eudoraweb") > -1 || navigator.userAgent.toLowerCase().indexOf("fly") > -1 || navigator.userAgent.toLowerCase().indexOf("hp.ipaq") > -1 || navigator.userAgent.toLowerCase().indexOf("haier") > -1 || navigator.userAgent.toLowerCase().indexOf("huawei") > -1 || navigator.userAgent.toLowerCase().indexOf("iemobile") > -1 || navigator.userAgent.toLowerCase().indexOf("j-phone") > -1 || navigator.userAgent.toLowerCase().indexOf("kddi") > -1 || navigator.userAgent.toLowerCase().indexOf("konka") > -1 || navigator.userAgent.toLowerCase().indexOf("kwc") > -1 || navigator.userAgent.toLowerCase().indexOf("kyocera/wx310k") > -1 || navigator.userAgent.toLowerCase().indexOf("lg") > -1 || navigator.userAgent.toLowerCase().indexOf("lg/u990") > -1 || navigator.userAgent.toLowerCase().indexOf("lenovo") > -1 || navigator.userAgent.toLowerCase().indexOf("midp-2.0") > -1 || navigator.userAgent.toLowerCase().indexOf("mmef20") > -1 || navigator.userAgent.toLowerCase().indexOf("mot-v") > -1 || navigator.userAgent.toLowerCase().indexOf("mobilephone") > -1 || navigator.userAgent.toLowerCase().indexOf("motorola") > -1 || navigator.userAgent.toLowerCase().indexOf("newgen") > -1 || navigator.userAgent.toLowerCase().indexOf("netfront") > -1 || navigator.userAgent.toLowerCase().indexOf("newt") > -1 || navigator.userAgent.toLowerCase().indexOf("nintendo wii") > -1 || navigator.userAgent.toLowerCase().indexOf("nitro") > -1 || navigator.userAgent.toLowerCase().indexOf("nokia") > -1 || navigator.userAgent.toLowerCase().indexOf("novarra") > -1 || navigator.userAgent.toLowerCase().indexOf("o2") > -1 || navigator.userAgent.toLowerCase().indexOf("opera mini") > -1 || navigator.userAgent.toLowerCase().indexOf("opera.mobi") > -1 || navigator.userAgent.toLowerCase().indexOf("pantech") > -1 || navigator.userAgent.toLowerCase().indexOf("pdxgw") > -1 || navigator.userAgent.toLowerCase().indexOf("pg") > -1 || navigator.userAgent.toLowerCase().indexOf("ppc") > -1 || navigator.userAgent.toLowerCase().indexOf("pt") > -1 || navigator.userAgent.toLowerCase().indexOf("palm") > -1 || navigator.userAgent.toLowerCase().indexOf("panasonic") > -1 || navigator.userAgent.toLowerCase().indexOf("philips") > -1 || navigator.userAgent.toLowerCase().indexOf("playstation portable") > -1 || navigator.userAgent.toLowerCase().indexOf("proxinet") > -1 || navigator.userAgent.toLowerCase().indexOf("proxinet") > -1 || navigator.userAgent.toLowerCase().indexOf("qtek") > -1 || navigator.userAgent.toLowerCase().indexOf("sch") > -1 || navigator.userAgent.toLowerCase().indexOf("sec") > -1 || navigator.userAgent.toLowerCase().indexOf("sgh") > -1 || navigator.userAgent.toLowerCase().indexOf("sharp-tq-gx10") > -1 || navigator.userAgent.toLowerCase().indexOf("sie") > -1 || navigator.userAgent.toLowerCase().indexOf("sph") > -1 || navigator.userAgent.toLowerCase().indexOf("sagem") > -1 || navigator.userAgent.toLowerCase().indexOf("samsung") > -1 || navigator.userAgent.toLowerCase().indexOf("sanyo") > -1 || navigator.userAgent.toLowerCase().indexOf("sendo") > -1 || navigator.userAgent.toLowerCase().indexOf("sharp") > -1 || navigator.userAgent.toLowerCase().indexOf("small") > -1 || navigator.userAgent.toLowerCase().indexOf("smartphone") > -1 || navigator.userAgent.toLowerCase().indexOf("softbank") > -1 || navigator.userAgent.toLowerCase().indexOf("sonyericsson") > -1 || navigator.userAgent.toLowerCase().indexOf("symbian") > -1 || navigator.userAgent.toLowerCase().indexOf("symbian os") > -1 || navigator.userAgent.toLowerCase().indexOf("symbianos") > -1 || navigator.userAgent.toLowerCase().indexOf("ts21i-10") > -1 || navigator.userAgent.toLowerCase().indexOf("toshiba") > -1 || navigator.userAgent.toLowerCase().indexOf("treo") > -1 || navigator.userAgent.toLowerCase().indexOf("up.browser") > -1 || navigator.userAgent.toLowerCase().indexOf("up.link") > -1 || navigator.userAgent.toLowerCase().indexOf("uts") > -1 || navigator.userAgent.toLowerCase().indexOf("vertu") > -1 || navigator.userAgent.toLowerCase().indexOf("willcome") > -1 || navigator.userAgent.toLowerCase().indexOf("winwap") > -1 || navigator.userAgent.toLowerCase().indexOf("windows ce") > -1 || navigator.userAgent.toLowerCase().indexOf("windows.ce") > -1 || navigator.userAgent.toLowerCase().indexOf("xda") > -1 || navigator.userAgent.toLowerCase().indexOf("zte") > -1 || navigator.userAgent.toLowerCase().indexOf("dopod") > -1 || navigator.userAgent.toLowerCase().indexOf("hiptop") > -1 || navigator.userAgent.toLowerCase().indexOf("htc") > -1 || navigator.userAgent.toLowerCase().indexOf("i-mobile") > -1 || navigator.userAgent.toLowerCase().indexOf("nokia") > -1 || navigator.userAgent.toLowerCase().indexOf("portalmmm") > -1) {
					if (navigator.platform.toLowerCase().indexOf("win32") == -1 && navigator.platform.toLowerCase().indexOf("win64") == -1) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			}

			function initializeWorkspace(a) {
				if (opts.container == "none") {
					if (!isMobile) {
						initialMobileHeight = document.documentElement.clientHeight;
						initialMobileWidth = document.documentElement.clientWidth
					} else {
						var b = window.outerHeight;
						var c = window.outerWidth;
						var d = window.devicePixelRatio;
						initialMobileHeight = b * d;
						initialMobileWidth = c * d
					}
				}
				setMagicNumbers();
				var e = false;
				var f = false;
				if ( typeof opts.displace == "object") {
					matrix = opts.displace;
					var g = 0;
					for (var h = 0; h < opts.displace.length; h++) {
						for (var i = 0; i < opts.displace[h].length; i++) {
							if (opts.displace[h][i].full == 1 && typeof opts.displace[h][i].first != "undefined") {
								var j = false;
								var k = true;
								var l = opts.axis;
								if ( typeof opts.displace[h][i].ajaxLoading != "undefined") {
									if (opts.displace[h][i].ajaxLoading) {
										j = true;
										k = false
									}
								} else {
									if (opts.ajaxLoading) {
										j = true;
										k = false
									}
								}
								if ($.trim(opts.displace[h][i].moveDirection) != "") {
									l = opts.displace[h][i].moveDirection
								}
								if (!e) {
									f = true;
									e = true
								} else {
									f = false
								}
								matrixOrder.push({
									id : a[g].id,
									first : f,
									row : h,
									column : i,
									ajaxLoading : j,
									loadedContent : k,
									axis : l
								});
								matrix[h][i].id = a[g].id;
								initialPositionX = i * displayWidth;
								initialPositionY = h * displayHeight;
								actualCol = i;
								actualRow = h;
								g++;
								if (matrixRows < h) {
									matrixRows = h
								}
								if (matrixColumns < i) {
									matrixColumns = i
								}
							}
						}
					}
					for (var h = 0; h < opts.displace.length; h++) {
						for (var i = 0; i < opts.displace[h].length; i++) {
							if (opts.displace[h][i].full == 1 && typeof opts.displace[h][i].first == "undefined") {
								if (g < a.length) {
									var j = false;
									var k = true;
									var l = opts.axis;
									if ( typeof opts.displace[h][i].ajaxLoading != "undefined") {
										if (opts.displace[h][i].ajaxLoading) {
											j = true;
											k = false
										}
									} else {
										if (opts.ajaxLoading) {
											j = true;
											k = false
										}
									}
									if ($.trim(opts.displace[h][i].moveDirection) != "") {
										l = opts.displace[h][i].moveDirection
									}
									if (!e) {
										f = true;
										e = true
									} else {
										f = false
									}
									matrixOrder.push({
										id : a[g].id,
										first : f,
										row : h,
										column : i,
										ajaxLoading : j,
										loadedContent : k,
										axis : l
									});
									if (matrixRows < h) {
										matrixRows = h
									}
									if (matrixColumns < i) {
										matrixColumns = i
									}
									matrix[h][i].id = a[g].id;
									g++
								}
							}
						}
					}
				} else {
					if (opts.displace == "row") {
						matrix[0] = new Array;
						for ( m = 0; m < a.length; m++) {
							var j = false;
							var k = true;
							if (opts.ajaxLoading) {
								j = true;
								k = false
							}
							if (!e) {
								f = true;
								e = true
							} else {
								f = false
							}
							matrixOrder.push({
								id : a[m].id,
								first : f,
								row : 0,
								column : m,
								ajaxLoading : j,
								loadedContent : k,
								axis : opts.axis
							});
							matrix[0].push({
								id : a[m].id,
								full : 1
							});
							matrixColumns++
						}
					} else if (opts.displace == "column") {
						matrix = new Array;
						for (var m = 0; m < a.length; m++) {
							var j = false;
							var k = true;
							if (opts.ajaxLoading) {
								j = true;
								k = false
							}
							if (!e) {
								f = true;
								e = true
							} else {
								f = false
							}
							matrixOrder.push({
								id : a[m].id,
								first : f,
								row : m,
								column : 0,
								ajaxLoading : j,
								loadedContent : k,
								axis : opts.axis
							});
							matrix[matrixRows] = new Array;
							matrix[matrixRows][0] = {
								id : a[m].id,
								full : 1
							};
							matrixRows++
						}
					}
				}
				if ("ontouchstart" in document.documentElement) {
					if (elementToScroll == "html,body") {
						document.addEventListener("touchstart", onTouchStart, false)
					} else {
						document.getElementById(elementToScroll.replace("#", "")).addEventListener("touchstart", onTouchStart, false)
					}
				}
				placeElements()
			}

			function getParentContainerId(a) {
				if ( typeof $("#" + a).parent().attr("class") != "undefined" && $("#" + a).parent().attr("class").indexOf(sliderClass) > -1) {
					if ( typeof $("#" + a).parent().attr("id") == "undefined") {
						$("#" + a).parent().attr("id", "internal_" + internalCounter++)
					}
					parentId = $("#" + a).parent().attr("id")
				} else {
					if ( typeof $("#" + a).parent().attr("id") == "undefined") {
						$("#" + a).parent().attr("id", "internal_" + internalCounter++)
					}
					getParentContainerId($("#" + a).parent().attr("id"))
				}
			}

			function fireNavigationFeedback(a, b, c, d) {
				if (opts.feedbackArrows) {
					var e = null;
					var f = null;
					var g = null;
					if (a > c) {
						f = "left"
					} else if (a < c) {
						f = "right"
					}
					if (b > d) {
						g = "up"
					} else if (b < d) {
						g = "down"
					}
					if (g != null) {
						e = g
					}
					if (f != null) {
						if (e != null) {
							e += "_" + f
						} else {
							e = f
						}
					}
					if (e != null) {
						var h = "img/" + e + "_arrow.png";
						$("#slidingSpacesNavigationFeedback").stop();
						$("#slidingSpacesNavigationFeedback").css({
							backgroundImage : "url(" + h + ")",
							backgroundRepeat : "no-repeat",
							backgroundPosition : "center center",
							opacity : "1",
							"z-index" : 1e3
						});
						$("#slidingSpacesNavigationFeedback").show();
						$("#slidingSpacesNavigationFeedback").animate({
							opacity : "0",
							"z-index" : "-100"
						}, 1e3, function() {
							$("#slidingSpacesNavigationFeedback").hide()
						})
					}
				}
			}

			function findElementInStack(a, b) {
				var c = false;
				var d = {
					id : null,
					column : -1,
					row : -1
				};
				var e = -1;
				$.each(matrixOrder, function(b) {
					if (!c) {
						if (matrixOrder[b].id == a) {
							e = b;
							c = true
						}
					}
				});
				if (b == "+") {
					if (e + 1 >= matrixOrder.length) {
						e = 0
					} else {
						e++
					}
				} else {
					if (e - 1 < 0) {
						e = matrixOrder.length - 1
					} else {
						e--
					}
				}
				return matrixOrder[e]
			}

			function findElementByPosition(a, b) {
				var c = false;
				var d = {
					id : null,
					column : -1,
					row : -1
				};
				$.each(matrixOrder, function(e) {
					if (!c) {
						if (matrixOrder[e].column == b && matrixOrder[e].row == a) {
							d = matrixOrder[e];
							c = true
						}
					}
				});
				return d
			}

			function findElementByOffset(a, b) {
				var c = false;
				var d = {
					id : null,
					row : -1,
					column : -1
				};
				$.each(matrixOrder, function(e) {
					if (!c) {
						var f = matrixOrder[e].row * b;
						var g = matrixOrder[e].column * a;
						if (f == actualOffsetY && g == actualOffsetX) {
							d = matrixOrder[e];
							c = true
						}
					}
				});
				return d
			}

			function findElementById(a) {
				var b = false;
				var c = {
					id : null,
					column : -1,
					row : -1
				};
				$.each(matrixOrder, function(d) {
					if (!b) {
						if (matrixOrder[d].id == a) {
							c = matrixOrder[d];
							b = true
						}
					}
				});
				return c
			}

			function destroyEvent(a) {
				$(elementToTrigger).unbind(a)
			}

			function createTimeBar() {
				if ($("#slidingSpacesPlayer").length > 0) {
					$("#slidingSpacesPlayer").append("<br/><div id='slidingSpacesPlayerTimerOut'><div id='slidingSpacesPlayerTimerIn'></div></div>")
				} else {
					createPlayer(false);
					$("#slidingSpacesPlayer").append("<div id='slidingSpacesPlayerTimerOut'><div id='slidingSpacesPlayerTimerIn'></div></div>")
				}
			}

			function createSensibleAreas() {
				$(elementToScroll).append("<div id='slidingSpacesSensibleArea_up' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
				$(elementToScroll).append("<div id='slidingSpacesSensibleArea_right' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
				$(elementToScroll).append("<div id='slidingSpacesSensibleArea_down' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
				$(elementToScroll).append("<div id='slidingSpacesSensibleArea_left' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
				if (elementToScroll != "html,body") {
					$("#slidingSpacesSensibleArea_up").width($(elementToScroll).width());
					$("#slidingSpacesSensibleArea_up").offset({
						top : $(elementToScroll).offset().top + eval($(elementToScroll).css("border-top-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_right").height($(elementToScroll).height());
					$("#slidingSpacesSensibleArea_right").offset({
						left : $(elementToScroll).width() + $(elementToScroll).offset().left - $("#slidingSpacesSensibleArea_right").width() + eval($(elementToScroll).css("border-right-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_down").width($(elementToScroll).width());
					$("#slidingSpacesSensibleArea_down").offset({
						top : $(elementToScroll).height() + $(elementToScroll).offset().top - $("#slidingSpacesSensibleArea_down").height() + eval($(elementToScroll).css("border-bottom-width").replace("px", ""))
					});
					$("#slidingSpacesSensibleArea_left").height($(elementToScroll).height());
					$("#slidingSpacesSensibleArea_left").offset({
						left : $(elementToScroll).offset().left + eval($(elementToScroll).css("border-left-width").replace("px", ""))
					})
				}
				$(".slidingSpacesSensibleArea").css("z-index", 1);
				$(".slidingSpacesSensibleArea").fadeTo(0, 0);
				$(".slidingSpacesSensibleArea").mouseover(function() {
					$(this).stop();
					var a = findElementByOffset(displayWidth, displayHeight);
					var b = $(this).attr("id").split("_");
					var c = a.row;
					var d = a.column;
					if (b[1] == "up") {
						c--
					} else if (b[1] == "right") {
						d++
					} else if (b[1] == "down") {
						c++
					} else if (b[1] == "left") {
						d--
					}
					var e = findElementByPosition(c, d);
					if (e.id != null) {
						$(this).fadeTo(200, .4);
						$(this).children("a").attr("href", "#" + e.id);
						$sens = $(this).children("a");
						$(this).bind("click", function(a) {
							clickEvent(a, $sens);
							$(this).fadeTo(0, 0)
						})
					}
				});
				$(".slidingSpacesSensibleArea").mouseout(function() {
					$(this).stop();
					$(this).fadeTo(200, 0)
				})
			}

			function createPlayer(a) {
				var b = "Play";
				if (opts.autoSlide) {
					b = "Pause"
				}
				var c = "light";
				if (opts.playerTheme == "dark") {
					c = opts.playerTheme
				}
				$(elementToTrigger).append("<div id='slidingSpacesPlayer'><div id='slidingSpacesPlayerPrev'><img src='img/prev_" + c + ".png' alt=''/></div><div id='slidingSpacesPlayerPlayPause' class='" + b + "'><img src='img/pause_" + c + ".png' alt=''/></div><div id='slidingSpacesPlayerNext'><img src='img/next_" + c + ".png' alt=''/></div></div>");
				if (!a) {
					$("#slidingSpacesPlayerPrev").css("display", "none");
					$("#slidingSpacesPlayerPlayPause").css("display", "none");
					$("#slidingSpacesPlayerNext").css("display", "none");
					$("#slidingSpacesPlayer").height(0)
				}
				$("#slidingSpacesPlayerPlayPause img").bind("click", function(a) {
					a.preventDefault();
					if ($("#slidingSpacesPlayerPlayPause").attr("class") == "playerPlay") {
						$("#slidingSpacesPlayerPlayPause").attr("class", "playerPause");
						$("#slidingSpacesPlayerPlayPause img").attr("src", "img/pause_" + c + ".png");
						play = true;
						if (opts.createTimeBar) {
							refreshTimerBar(timeLeft)
						}
						autoPlayStartTime = (new Date).getTime();
						t = setTimeout(autoPlay, timeLeft);
						timeLeft = opts.autoSlideTime
					} else {
						$("#slidingSpacesPlayerPlayPause").attr("class", "playerPlay");
						$("#slidingSpacesPlayerPlayPause img").attr("src", "img/play_" + c + ".png");
						play = false;
						clearTimeout(t);
						if (opts.createTimeBar) {
							refreshTimerBar(null)
						}
						timeLeft = opts.autoSlideTime - ((new Date).getTime() - autoPlayStartTime)
					}
				});
				$("#slidingSpacesPlayerPrev").bind("click", function(a) {
					$("#slidingSpacesPlayerPrev").attr("href", "#" + findElementInStack(actualElementObject.id, "-").id);
					clearTimeout(t);
					if (opts.createTimeBar) {
						refreshTimerBar(opts.autoSlideTime)
					}
					if (play) {
						t = setTimeout(autoPlay, 0);
						$("#slidingSpacesPlayerPrev").removeAttr("href")
					} else {
						autoPlayStartTime = (new Date).getTime();
						clickEvent(null, $("#slidingSpacesPlayerPrev"));
						$("#slidingSpacesPlayerPrev").removeAttr("href")
					}
				});
				$("#slidingSpacesPlayerNext").bind("click", function(a) {
					$("#slidingSpacesPlayerNext").attr("href", "#" + findElementInStack(actualElementObject.id, "+").id);
					if (opts.createTimeBar) {
						refreshTimerBar(opts.autoSlideTime)
					}
					clearTimeout(t);
					if (play) {
						t = setTimeout(autoPlay, 0);
						$("#slidingSpacesPlayerNext").removeAttr("href")
					} else {
						autoPlayStartTime = (new Date).getTime();
						clickEvent(null, $("#slidingSpacesPlayerNext"));
						$("#slidingSpacesPlayerNext").removeAttr("href")
					}
				});
				positionPlayer()
			}

			function createMap() {
				$(elementToScroll).append("<div id='slidingSpacesNavigationMap'></div>");
				var a = findElementByOffset(displayWidth, displayHeight).id;
				if ($.trim(anchor) != "") {
					anchor2 = anchor.replace("#", "");
					anchor2 = anchor2.replace("!", "");
					var b = findElementById(anchor2);
					a = b.id
				}
				for (var c = 0; c < matrix.length; c++) {
					for (var d = 0; d < matrix[c].length; d++) {
						var e = "";
						var f = "";
						var g = "";
						var h = "slidingSpacesNavigationDot";
						if (matrix[c][d].full != 1) {
							h = "slidingSpacesNavigationDotEmpty"
						} else {
							if (matrix[c][d].id == a) {
								var h = "slidingSpacesNavigationDotActual"
							} else {
								if (!isMobile) {
									var e = "href='#" + matrix[c][d].id + "'"
								}
							}
						}
						if ( typeof matrix[c][d].id != "undefined") {
							f = "id='slidingSpacesNavigationDot_" + matrix[c][d].id + "'"
						}
						if ( typeof $("#" + matrix[c][d].id).attr("title") != "undefined") {
							g = "title='" + $("#" + matrix[c][d].id).attr("title") + "'"
						}
						$("#slidingSpacesNavigationMap").append("<a " + f + " class='" + h + "' " + e + " " + g + "></a>")
					}
					$("#slidingSpacesNavigationMap").append("<br clear='all'/>")
				}
				if (opts.tips) {
					var i = $('<div id="slidingSpacesTipOuter"></div>');
					var j = $('<div id="slidingSpacesTipContent"></div>');
					var k = $('<div id="slidingSpacesTipArrow"></div>');
					var l = $('<div id="slidingSpacesTipArrowInner"></div>');
					k.append(j).append(l);
					i.append(j).append(k);
					$("#slidingSpacesNavigationMap").append(i);
					$(".slidingSpacesNavigationDot, .slidingSpacesNavigationDotActual").hover(function(a) {
						$(this).data("tipTitle", "");
						var b = $(this).attr("title");
						$(this).data("tipTitle", b);
						$(this).removeAttr("title");
						var c = $(this).position().left;
						var d = $(this).position().top;
						var e = $(this).offset().left;
						var f = $(this).offset().top;
						var g = $(this).outerWidth(true);
						var h = $(this).outerHeight(true);
						var i = opts.mapPosition.split("_");
						$("#slidingSpacesTipOuter").animate({
							opacity : 0
						}, 0);
						$("#slidingSpacesTipOuter").show();
						$("#slidingSpacesTipContent").html(b);
						if (opts.tipsPosition == "top") {
							var j = c + g / 2 - $("#slidingSpacesTipContent").outerWidth(true) / 2;
							var k = d - h / 2 - $("#slidingSpacesTipContent").outerHeight(true) - 5;
							var l = $("#slidingSpacesTipContent").outerWidth(true) / 2 - $("#slidingSpacesTipArrow").outerWidth(true) / 2;
							$("#slidingSpacesTipOuter").addClass("tipTop");
							$("#slidingSpacesTipOuter").css({
								marginLeft : j,
								marginTop : k
							});
							$("#slidingSpacesTipArrow").css({
								left : l
							})
						} else if (opts.tipsPosition == "right") {
							var j = c + g + 5;
							var k = d + h / 2 - $("#slidingSpacesTipContent").outerHeight(true) / 2;
							var l = -$("#slidingSpacesTipArrow").outerWidth(true) + 5;
							var m = $("#slidingSpacesTipContent").outerHeight(true) / 2 - $("#slidingSpacesTipArrow").outerHeight(true) / 2;
							$("#slidingSpacesTipOuter").addClass("tipRight");
							$("#slidingSpacesTipOuter").css({
								marginLeft : j,
								marginTop : k
							});
							$("#slidingSpacesTipArrow").css({
								left : l,
								top : m
							})
						} else if (opts.tipsPosition == "left") {
							var j = -$("#slidingSpacesTipContent").outerWidth(true) - 5;
							var k = d + h / 2 - $("#slidingSpacesTipContent").outerHeight(true) / 2;
							var l = $("#slidingSpacesTipContent").outerWidth(true);
							var m = $("#slidingSpacesTipContent").outerHeight(true) / 2 - $("#slidingSpacesTipArrow").outerHeight(true) / 2;
							$("#slidingSpacesTipOuter").addClass("tipLeft");
							$("#slidingSpacesTipOuter").css({
								marginLeft : j,
								marginTop : k
							});
							$("#slidingSpacesTipArrow").css({
								left : l,
								top : m
							})
						} else if (opts.tipsPosition == "bottom") {
							var j = c + g / 2 - $("#slidingSpacesTipContent").outerWidth(true) / 2;
							var k = d + h / 2 + $("#slidingSpacesTipContent").position().top + 10;
							var l = $("#slidingSpacesTipContent").outerWidth(true) / 2 - $("#slidingSpacesTipArrow").outerWidth(true) / 2;
							var m = -$("#slidingSpacesTipArrow").outerHeight(true) + 5;
							$("#slidingSpacesTipOuter").addClass("tipBottom");
							$("#slidingSpacesTipOuter").css({
								marginLeft : j,
								marginTop : k
							});
							$("#slidingSpacesTipArrow").css({
								left : l,
								top : m
							})
						}
						if ($(this).hasClass("slidingSpacesNavigationDot")) {
							$("#slidingSpacesTipOuter").animate({
								opacity : 1
							}, 400)
						}
					}, function(a) {
						$("#slidingSpacesTipContent").html("");
						$("#slidingSpacesTipOuter").hide();
						$(this).attr("title", $(this).data("tipTitle"))
					})
				}
				$("#slidingSpacesNavigationMap").bind("mouseover", function(a) {
					$("#slidingSpacesNavigationMap").stop();
					$("#slidingSpacesNavigationMap").animate({
						opacity : 1
					}, 200)
				});
				$("#slidingSpacesNavigationMap").bind("mouseleave", function(a) {
					$("#slidingSpacesNavigationMap").stop();
					$("#slidingSpacesNavigationMap").animate({
						opacity : .5
					}, 0)
				});
				positionMap()
			}

			function clickEvent(a, b) {
				if (a != null) {
					a.preventDefault()
				}
				$(elementToScroll).stop();
				var c = findElementById(b.attr("href").replace("#", ""));
				var d = null;
				var e = null;
				var f = null;
				var g = actualRow;
				var h = actualCol;
				var i = findElementByOffset(displayWidth, displayHeight).axis;
				var j = c.column * displayWidth;
				var k = c.row * displayHeight;
				destroyEvent("startslide");
				triggerEvent("startslide", actualElementObject, c);
				if (i == "xy") {
					fireNavigationFeedback(actualCol, null, c.column, null);
					$(elementToScroll).animate({
						scrollLeft : j
					}, opts.time, opts.easing, function() {
						fireNavigationFeedback(null, g, null, c.row);
						$(elementToScroll).animate({
							scrollTop : k
						}, opts.time, opts.easing, function() {
							initialPositionY = k;
							initialPositionX = j;
							loadContent(c);
							destroyEvent("endslide");
							triggerEvent("endslide", actualElementObject, c);
							actualElementObject = c
						})
					})
				} else if (i == "yx") {
					fireNavigationFeedback(null, g, null, c.row);
					$(elementToScroll).animate({
						scrollTop : k
					}, opts.time, opts.easing, function() {
						fireNavigationFeedback(h, null, c.column, null);
						$(elementToScroll).animate({
							scrollLeft : j
						}, opts.time, opts.easing, function() {
							initialPositionY = k;
							initialPositionX = j;
							loadContent(c);
							destroyEvent("endslide");
							triggerEvent("endslide", actualElementObject, c);
							actualElementObject = c
						})
					})
				} else {
					fireNavigationFeedback(h, g, c.column, c.row);
					$(elementToScroll).animate({
						scrollTop : k,
						scrollLeft : j
					}, opts.time, opts.easing, function() {
						initialPositionY = k;
						initialPositionX = j;
						loadContent(c);
						destroyEvent("endslide");
						triggerEvent("endslide", actualElementObject, c);
						actualElementObject = c
					})
				}
				window.location.hash = "#!" + c.id;
				actualCol = c.column;
				actualRow = c.row;
				actualOffsetX = j;
				actualOffsetY = k;
				if (opts.createMap) {
					refreshMap(b.attr("href").replace("#", ""))
				}
			}

			function cancelTouch() {
				this.removeEventListener("touchmove", onTouchMove);
				scrollStartX = null;
				scrollStartY = null;
				isMoving = false
			}

			function autoPlay() {
				if (play) {
					clearTimeout(t);
					$("#slidingSpacesPlayerTimerIn").width("0%");
					refreshTimerBar(opts.autoSlideTime);
					$("#slidingSpacesPlayerPlayPause").attr("href", "#" + findElementInStack(actualElementObject.id, "+").id);
					autoPlayStartTime = (new Date).getTime();
					clickEvent(null, $("#slidingSpacesPlayerPlayPause"));
					$("#slidingSpacesPlayerPlayPause").removeAttr("href");
					t = setTimeout(autoPlay, opts.autoSlideTime)
				}
			}

			var defaults = {
				ajaxLoading : false,
				ajaxScript : "",
				autoSlide : false,
				autoSlideTime : 5e3,
				axis : "",
				backGroundImageClass : "",
				container : "none",
				createLinks : false,
				createMap : false,
				createPlayer : false,
				createSensibleAreas : false,
				createTimeBar : false,
				displace : "row",
				easing : "linear",
				feedbackArrows : false,
				fullScreenBackground : false,
				linkClass : "",
				mapPosition : "bottom_right",
				playerPosition : "bottom_center",
				playerTheme : "light",
				preloadBackgroundImages : false,
				preventArrowNavigation : false,
				time : 300,
				tips : false,
				tipsPosition : "top"
			};
			var opts = $.extend({}, defaults, options);
			var matrix = new Array;
			var matrixOrder = new Array;
			var displayWidth = 0;
			var displayHeight = 0;
			var offsetX = 0;
			var offsetY = 0;
			var initialPositionX = 0;
			var initialPositionY = 0;
			var actualCol = 0;
			var actualRow = 0;
			var elementToScroll = "html,body";
			var elementToTrigger = "html";
			var zIndex = -1e3;
			var zIndexDecrement = 0;
			var matrixRows = 0;
			var matrixColumns = 0;
			var actualOffsetX = 0;
			var actualOffsetY = 0;
			var scrollStartX = null;
			var scrollStartY = null;
			var min_move_x = 20;
			var min_move_y = 20;
			var isMoving = false;
			var initialMobileHeight = 0;
			var initialMobileWidth = 0;
			var previousOrientation = 0;
			var isMobile = isMobile();
			var sliderClass = this.selector.replace(".", "");
			var internalCounter = 0;
			var distance = null;
			var parentId = null;
			var scrollTimeStart = null;
			var actualElementObject = null;
			var play = false;
			var autoPlayStartTime = 0;
			var timeLeft = opts.autoSlideTime;
			var t = null;
			if (isMobile) {
				$("head").append('<meta name="viewport" id="vpFerroSlider" content="width=device-width, height=device-height, user-scalable=no, initial-scale=' + 1 / window.devicePixelRatio + ", minimum-scale = " + Math.round(1 / window.devicePixelRatio * 100) / 100 + ", maximum-scale = " + Math.round(1 / window.devicePixelRatio * 100) / 100 + ';"/>');
				if (screen.width > 780 || screen.height > 1030) {
					window.location.reload()
				}
			}
			initializeWorkspace(this);
			if (isMobile) {
				$(elementToScroll).css("overflow", "auto")
			}
			actualOffsetY = initialPositionY;
			actualOffsetX = initialPositionX;
			window.scrollTo(0, 0);
			window.scrollTo(initialPositionX, initialPositionY);
			$(document.body).append("<div id='slidingSpacesNavigationFeedback'></div>");
			$("#slidingSpacesNavigationFeedback").hide();
			$("#slidingSpacesNavigationFeedback").width(displayWidth);
			$("#slidingSpacesNavigationFeedback").height(displayHeight);
			$("#slidingSpacesNavigationFeedback").css({
				marginLeft : offsetX,
				marginTop : offsetY
			});
			var anchor = window.location.hash;
			if ($.trim(anchor) != "") {
				anchor = anchor.replace("#", "");
				anchor = anchor.replace("!", "");
				var actualEl = findElementById(anchor);
				actualCol = actualEl.column;
				actualRow = actualEl.row;
				actualElementObject = findElementById(anchor.replace("#", ""));
				actualOffsetY = actualElementObject.row * displayHeight;
				actualOffsetX = actualElementObject.column * displayWidth;
				window.location.hash = anchor
			} else {
				actualElementObject = matrixOrder[0]
			}
			if (opts.createLinks) {
				$(".slidingSpacesOuterDiv").each(function(a) {
					var b = $(this);
					b.append("<div id='slidingSpacesNavigation_" + b.attr("id") + "' class='slidingSpacesNavigation'><ul></ul></div>");
					for (var c = 0; c < matrixOrder.length; c++) {
						if (a != c) {
							if ($("#" + matrixOrder[c].id).attr("title") != "" && $("#" + matrixOrder[c].id).attr("title") != null) {
								var d = $("#" + matrixOrder[c].id).attr("title")
							} else {
								var d = "Page " + c
							}
							$("#slidingSpacesNavigation_" + b.attr("id") + " ul").append("<li><a href='#" + matrixOrder[c].id + "' class='slidingSpacesNavigationLink' >" + d + "</a></li>")
						}
					}
				})
			}
			if (opts.createMap) {
				createMap()
			}
			if (opts.autoSlide) {
				play = true;
				if (opts.createPlayer) {
					createPlayer(true)
				}
				if (opts.createTimeBar) {
					createTimeBar()
				}
				$("#slidingSpacesPlayerTimerIn").width("0%");
				refreshTimerBar(opts.autoSlideTime);
				autoPlayStartTime = (new Date).getTime();
				t = setTimeout(autoPlay, opts.autoSlideTime)
			}
			if (opts.createSensibleAreas) {
				createSensibleAreas()
			}
			if (!opts.preventArrowNavigation) {
				$(document).keydown(function(a) {
					if ($("*:focus").is("textarea, input, option, select")) {
					} else {
						var b = a.keyCode || a.which;
						var c = {
							left : 37,
							up : 38,
							right : 39,
							down : 40
						};
						var d = false;
						var e = null;
						var f = actualCol;
						var g = actualRow;
						switch(b) {
							case c.left:
								a.preventDefault();
								if (actualCol > 0) {
									var h = findElementByPosition(actualRow, actualCol - 1);
									if (h.id != null) {
										actualCol--;
										d = true
									}
								}
								break;
							case c.up:
								a.preventDefault();
								if (actualRow > 0) {
									var h = findElementByPosition(actualRow - 1, actualCol);
									if (h.id != null) {
										actualRow--;
										d = true
									}
								}
								break;
							case c.right:
								a.preventDefault();
								if (actualCol < matrixColumns) {
									var h = findElementByPosition(actualRow, actualCol + 1);
									if (h.id != null) {
										actualCol++;
										d = true
									}
								}
								break;
							case c.down:
								a.preventDefault();
								if (actualRow < matrixRows) {
									var h = findElementByPosition(actualRow + 1, actualCol);
									if (h.id != null) {
										actualRow++;
										d = true
									}
								}
								break
						}
						if (d) {
							var i = h.column * displayWidth;
							var j = h.row * displayHeight;
							destroyEvent("startslide");
							triggerEvent("startslide", actualElementObject, h);
							fireNavigationFeedback(f, g, actualCol, actualRow);
							$(elementToScroll).stop();
							$(elementToScroll).animate({
								scrollTop : j,
								scrollLeft : i
							}, opts.time, opts.easing, function() {
								$(elementToScroll).stop();
								actualOffsetY = j;
								actualOffsetX = i;
								loadContent(h);
								$(elementToScroll).animate({
									scrollTop : j,
									scrollLeft : i
								}, 0);
								window.location.hash = "#!" + h.id;
								actualElementObject = h;
								destroyEvent("endslide");
								triggerEvent("endslide", actualElementObject, h)
							});
							if (opts.createMap) {
								refreshMap(h.id)
							}
						}
					}
				})
			}
			var linksClasses = ".slidingSpacesNavigationLink, .slidingSpacesNavigationDot";
			if ($.trim(opts.linkClass) != "") {
				var linksClasses = linksClasses + ", ." + opts.linkClass
			}
			$(linksClasses).each(function(a) {
				var b = $(this);
				b.bind("click", function(a) {
					clickEvent(a, b)
				});
				b.bind("touchstart", function(a) {
					clickEvent(a, b)
				})
			});
			revMob = function() {
				var a = displayWidth;
				var b = displayHeight;
				setMagicNumbers();
				refreshPositionMobile(a, b);
				if (opts.createMap) {
					positionMap()
				}
			};
			if (!isMobile) {
				$(window).resize(function() {
					revalidate()
				})
			}
			if ("onorientationchange" in window) {
				window.addEventListener("orientationchange", function() {
					if (window.orientation !== previousOrientation) {
						previousOrientation = window.orientation;
						setTimeout(revMob, 100)
					}
				}, false)
			}
		}
	};
	$.fn.ferroSlider = function(a) {
		return methods.ferroSliderDesktop.call(this, a)
	}
})(jQuery)