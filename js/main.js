var searchTool = {
  generateURL: function(index) {
    var searchStrArr = [
      "https://www.baidu.com/s?ie=UTF-8&wd=",
      "https://www.google.com.hk/?gws_rd=ssl#safe=strict&q=",
      "http://cn.bing.com/search?q=",
      "http://s.weibo.com/weibo/",
      "https://www.zhihu.com/search?type=content&q=",
      "https://www.douban.com/search?q=",
      "http://www.panc.cc/s/"
    ]

    return searchStrArr[index] + encodeURIComponent(textObj.getTextValue())
  },
  isTextEmpty: function(index) {
    return textObj.getTextValue().trim() == ""
  },
  goSearch: function() {
    if (!this.isTextEmpty()) {
      var url = this.generateURL(optionObj.getOption())
      window.open(url)
    }
    textObj.setTextValue("")
  }
}

var formObj = (function() {
  var form = document.getElementById("search")

  return {
    bindEvent: function() {
      form.onsubmit = function() {
        searchTool.goSearch()
        return false
      }
    }
  }
})()

var optionObj = (function() {
  var options = document.getElementsByName("option")

  return {
    getOption: function() {
      for (var i = 0; i < options.length; ++i) {
        if (options[i].checked) {
          return i
        }
      }
    }
  }
})()

var textObj = (function() {
  var sText = document.getElementById("search-text")

  return {
    bindEvent: function() {
      sText.addEventListener("mouseover", textObj.textFocus)
      sText.addEventListener("mouseout", textObj.textBlur)
      sText.addEventListener("blur", textObj.textBlur)
    },
    getTextValue: function() {
      return sText.value
    },
    setTextValue: function(str) {
      sText.value = str
    },
    textFocus: function() {
      sText.className += " text-focus"
    },
    textBlur: function() {
      if (document.activeElement.id != "search-text") {
        sText.className = sText.className.replace(/\stext-focus/, " ")
      }
    }
  }
})()

var catalogObj = (function() {
  var catalogs = document.getElementsByClassName("catalog")

  return {
    bindEvent: function() {
      for (var i = 0; i < catalogs.length; ++i) {
        (function(index) {
          catalogs[index].addEventListener("mouseenter", function() {
            catalogObj.catalogFocus(index)
          })
          catalogs[index].addEventListener("mouseleave", function() {
            catalogObj.catalogBlur(index)
          })
        })(i)
      }
    },
    catalogFocus: function(index) {
      catalogs[index].className += " focus-bg"
      overlayObj.focus(index)
    },
    catalogBlur: function(index) {
      catalogs[index].className = catalogs[index].className.replace(/\sfocus-bg/, "")
      overlayObj.normalize(index)
    }
  }
})()

var overlayObj = (function() {
  var overlays = document.getElementsByClassName("overlay")

  return {
    normalize: function(index) {
      overlays[index].style.display = "inline-block"
      overlays[index].className = overlays[index].className.replace(/\soverlay-focus/, "")
    },
    focus: function(index) {
      overlays[index].style.display = "inline-block"
      if (!/\soverlay-focus/.test(overlays[index].className)) {
        overlays[index].className += " overlay-focus"
      }
    },
    hide: function(index) {
      overlays[index].style.display = "none"
    }
  }
})()

var lastItemObj = (function() {
  var lastItems = document.getElementsByClassName("last")

  return {
    bindEvent: function() {
      for (var i = 0; i < lastItems.length; ++i) {
        (function(index) {
          lastItems[index].addEventListener("mouseenter", function() {
            lastItemObj.lastFocus(index)
          })
          lastItems[index].addEventListener("mouseleave", function() {
            lastItemObj.lastBlur(index)
          })
        })(i)
      }
    },
    lastFocus: function(index) {
      extendItemObj.display(index)
      overlayObj.hide(index)
    },
    lastBlur: function(index) {
      extendItemObj.hide(index)
      overlayObj.focus(index)
    }
  }
})()

var extendItemObj = (function() {
  var extendItems = document.getElementsByClassName("extend")

  return {
    bindEvent: function () {
      for (var i = 0; i < extendItems.length; ++i) {
        (function(index) {
          extendItems[index].addEventListener("mouseover", function() {
            extendItemObj.display(index)
          })
          extendItems[index].addEventListener("mouseleave", function() {
            extendItemObj.hide(index)
          })
        })(i)
      }
    },
    display: function (index) {
      extendItems[index].style.display = "block"
      overlayObj.hide(index)
    },
    hide: function (index) {
      extendItems[index].style.display = "none"
    }
  }
})()

var cataContentObj = (function () {
  var cataContent = document.getElementsByClassName('catalog-content')

  return {
    isShowing: function (i) {
      return cataContent[i].getAttribute('show') === 'true'
    },
    setShowing: function (i) {
      cataContent[i].style.display = "block"
      cataContent[i].setAttribute('show', 'true')
    },
    setHidden: function (i) {
      cataContent[i].style.display = "none"
      cataContent[i].setAttribute('show', 'false')
    }
  }
})()

var foldObj = (function () {
  var folds = document.getElementsByClassName('unfold')

  return {
    setShowing: function (i) {
      folds[i].style.display = "block"
    },
    setHidden: function (i) {
      folds[i].style.display = "none"
    }
  }
})()

var cataTitleObj = (function () {
  var cataTitle = document.getElementsByClassName('catalog-title')

  return {
    bindEvent: function () {
      for (var i = 0; i < cataTitle.length; ++i) {
        (function(index) {
          cataTitle[index].addEventListener("click", function() {
            if (cataContentObj.isShowing(index)) {
              cataContentObj.setHidden(index)
              foldObj.setShowing(index)
            } else {
              cataContentObj.setShowing(index)
              foldObj.setHidden(index)
            }
          })
        })(i)
      }
    }
  }
})()

window.onload = function () {
  if (detectMob()) {
    cataTitleObj.bindEvent()
  } else {
    formObj.bindEvent()
    textObj.bindEvent()
    catalogObj.bindEvent()
    lastItemObj.bindEvent()
    extendItemObj.bindEvent()
  }
}
