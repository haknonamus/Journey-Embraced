(function () {
  'use strict';

  var POSTS = [
    {
      href: 'post-narcissists-therapy.html',
      date: '2025-09-03',
      topic: 'narcissistic-abuse-recovery',
      topicLabel: 'Narcissistic Abuse Recovery',
      topicColor: 'purple',
      title: 'Why you might be drawn to narcissists, even in therapy',
      deck: 'How unexamined patterns can lead survivors to choose unsafe mental health providers. Choose wisely who helps you.',
      img: 'https://static.wixstatic.com/media/f3df2a_97ab278cfcd94450b3c3a21420873f29~mv2.jpg/v1/fill/w_908,h_397,fp_0.50_0.50,q_90,enc_avif,quality_auto/f3df2a_97ab278cfcd94450b3c3a21420873f29~mv2.webp',
      imgAlt: 'Why You Might Be Drawn to Narcissists—Even in Therapy',
      authorImg: 'https://static.wixstatic.com/media/f3df2a_c4966da03c5444bfa4be684ac20dc3af~mv2.jpg/v1/fill/w_64,h_64,al_c,q_80,enc_avif,quality_auto/f3df2a_c4966da03c5444bfa4be684ac20dc3af~mv2.jpg',
      authorName: 'Tanise Smith',
      byline: 'Tanise I. Smith, MS, LCPC &middot; 2 min read'
    },
    {
      href: 'post-say-no.html',
      date: '2025-01-31',
      topic: 'self-care',
      topicLabel: 'Self-Care',
      topicColor: 'teal',
      title: 'Say no: improve your mental and physical well-being',
      deck: 'Take control of your health and improve your quality of life by activating your No. Setting boundaries starts here.',
      img: 'https://static.wixstatic.com/media/nsplsh_32547a5375515a4f486534~mv2_d_3019_4025_s_4_2.jpg/v1/fill/w_908,h_397,fp_0.50_0.50,q_90,enc_avif,quality_auto/nsplsh_32547a5375515a4f486534~mv2_d_3019_4025_s_4_2.webp',
      imgAlt: 'Say No: Improve Your Mental and Physical Well-Being',
      authorImg: 'https://static.wixstatic.com/media/f3df2a_ed8cdbc0320a438393f0426898f3b0ae~mv2.jpg/v1/fill/w_64,h_64,al_c,q_80,enc_avif,quality_auto/f3df2a_ed8cdbc0320a438393f0426898f3b0ae~mv2.jpg',
      authorName: 'Cynthia Stokes',
      byline: 'Cynthia Stokes, LCC &middot; 4 min read'
    },
    {
      href: 'post-smart-goals.html',
      date: '2024-12-19',
      topic: 'life-coaching',
      topicLabel: 'Life Coaching',
      topicColor: 'coral',
      title: 'Wanting your goals to stick? Make them SMART',
      deck: 'Learn how to make your goals SMART using simple steps and why you get better results — applicable to any resolution.',
      img: 'https://static.wixstatic.com/media/nsplsh_63595f54434b723562656b~mv2.jpg/v1/fill/w_908,h_397,fp_0.50_0.50,q_90,enc_avif,quality_auto/nsplsh_63595f54434b723562656b~mv2.webp',
      imgAlt: 'Wanting Your Goals to Stick? Make them SMART!',
      authorImg: 'https://static.wixstatic.com/media/f3df2a_ed8cdbc0320a438393f0426898f3b0ae~mv2.jpg/v1/fill/w_64,h_64,al_c,q_80,enc_avif,quality_auto/f3df2a_ed8cdbc0320a438393f0426898f3b0ae~mv2.jpg',
      authorName: 'Cynthia Stokes',
      byline: 'Cynthia Stokes, LCC &middot; 3 min read'
    }
  ];

  function featuredHtml(post) {
    return '' +
      '<a href="' + post.href + '" class="blog-featured">' +
        '<img class="blog-featured-img" src="' + post.img + '" alt="' + post.imgAlt + '" />' +
        '<span class="blog-topic-label blog-topic-label--' + post.topicColor + '">' + post.topicLabel + '</span>' +
        '<h2>' + post.title + '</h2>' +
        '<p class="blog-deck">' + post.deck + '</p>' +
        '<div class="blog-byline">' +
          '<img class="blog-byline-img" src="' + post.authorImg + '" alt="' + post.authorName + '" />' +
          '<span>' + post.byline + '</span>' +
        '</div>' +
      '</a>';
  }

  function riverItemHtml(post) {
    return '' +
      '<a href="' + post.href + '" class="blog-river-item">' +
        '<img class="blog-river-img" src="' + post.img + '" alt="' + post.imgAlt + '" />' +
        '<div class="blog-river-body">' +
          '<span class="blog-topic-label blog-topic-label--' + post.topicColor + '">' + post.topicLabel + '</span>' +
          '<h3>' + post.title + '</h3>' +
          '<span class="blog-river-byline">' + post.byline + '</span>' +
        '</div>' +
      '</a>';
  }

  function render(topic) {
    var featuredSlot = document.getElementById('blogFeaturedSlot');
    var river = document.getElementById('blogRiver');
    var emptyMsg = document.getElementById('blogEmpty');
    if (!featuredSlot || !river) return;

    var matches = POSTS.filter(function (p) {
      return topic === 'all' || p.topic === topic;
    }).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    if (!matches.length) {
      featuredSlot.innerHTML = '';
      river.innerHTML = '';
      if (emptyMsg) emptyMsg.style.display = '';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    featuredSlot.innerHTML = featuredHtml(matches[0]);
    river.innerHTML = matches.slice(1).map(riverItemHtml).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var topicBtns = document.querySelectorAll('.blog-topic');
    if (!topicBtns.length) return;

    render('all');

    topicBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        topicBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        render(btn.getAttribute('data-topic'));
      });
    });
  });
})();
