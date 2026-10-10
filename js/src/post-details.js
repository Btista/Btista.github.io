/* global NexT: true */

$(document).ready(function () {

  initScrollSpy();
  initTOCDimension();

  function initScrollSpy () {
    var tocSelector = '.post-toc';
    var activeCurrentClass = 'active-current';
    var $tocElement = $(tocSelector);

    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass(activeCurrentClass);
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    $('body').scrollspy({ target: tocSelector });

    function removeCurrentActiveClass () {
      $(tocSelector + ' .' + activeCurrentClass).removeClass(activeCurrentClass);
    }
  }

  function initTOCDimension () {
    var updateTOCHeightTimer;

    $(window).on('resize', function () {
      updateTOCHeightTimer && clearTimeout(updateTOCHeightTimer);

      updateTOCHeightTimer = setTimeout(function () {
        updateTOCHeight(document.body.clientHeight - 100);
      }, 0);
    });

    // Initialize TOC Height.
    updateTOCHeight(document.body.clientHeight - 100);

    // Initialize TOC Width.
    var scrollbarWidth = NexT.utils.getScrollbarWidth();
    $('.post-toc').css('width', 'calc(100% + ' + scrollbarWidth + 'px)');
  }

  function updateTOCHeight (height) {
    $('.post-toc').css('max-height', height || 'auto');
  }

});

$(document).ready(function () {
  var $html = $('html');
  var TAB_ANIMATE_DURATION = 200;

  $('.sidebar-nav li').on('click', function () {
    var $item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';

    if ($item.hasClass(activeTabClassName)) {
      return;
    }

    var $currentTarget = $('.' + activePanelClassName);
    var $target = $('.' + $item.data('target'));

    $currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
      $target
        .velocity('stop')
        .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
        .addClass(activePanelClassName);
    });

    $item.siblings().removeClass(activeTabClassName);
    $item.addClass(activeTabClassName);
  });

  $('.post-toc a').on('click', function (e) {
    e.preventDefault();

    var $target = $(NexT.utils.escapeSelector(this.getAttribute('href')));

    if (!$target.length) {
      return;
    }

    $html.velocity('stop').velocity('scroll', {
      offset: $target.offset().top + 'px',
      mobileHA: false
    });
  });

  // Expand sidebar on post detail page by default, when post has a toc.
  NexT.motion.middleWares.sidebar = function () {
    var $tocContent = $('.post-toc-content');

    if (CONFIG.sidebar.display === 'post' || CONFIG.sidebar.display === 'always') {
      if ($tocContent.length > 0 && $tocContent.html().trim().length > 0) {
        NexT.utils.displaySidebar();
      }
    }
  };
});
