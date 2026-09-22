(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function typeInto(el, text, speed) {
    return new Promise(function (resolve) {
      el.textContent = '';
      el.classList.add('cursor');
      var i = 0;
      function step() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i += 1;
          setTimeout(step, speed);
        } else {
          el.classList.remove('cursor');
          resolve();
        }
      }
      step();
    });
  }

  var intro = document.getElementById('intro');
  var introDone = false;

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    if (!intro) {
      document.body.classList.add('pronto');
      return;
    }
    intro.classList.add('sair');
    setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
      document.body.classList.add('pronto');
    }, 850);
  }

  async function runIntro() {
    if (!intro) {
      document.body.classList.add('pronto');
      return;
    }
    if (reduce) {
      finishIntro();
      return;
    }
    var hello = intro.querySelector('.intro-hello');
    var nome = intro.querySelector('.intro-nome');
    var cargo = intro.querySelector('.intro-cargo');
    await wait(280);
    await typeInto(hello, 'Seja bem-vindo', 68);
    await wait(380);
    if (nome) nome.classList.add('show');
    await wait(420);
    if (cargo) cargo.classList.add('show');
    await wait(1300);
    finishIntro();
  }

  if (intro) {
    intro.addEventListener('click', finishIntro);
    runIntro();
  } else {
    document.body.classList.add('pronto');
  }

  var progress = document.querySelector('.scroll-progress');
  var fadeCinza = document.querySelector('.fade-cinza');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = 'scaleX(' + p + ')';
    var tech = document.getElementById('tecnologias');
    var obj = document.getElementById('objetivos');
    if (tech && tech.getBoundingClientRect().top < window.innerHeight * 0.58) {
      document.body.classList.add('zona-dark');
    } else {
      document.body.classList.remove('zona-dark');
    }
    if (fadeCinza && obj) {
      var start = y + obj.getBoundingClientRect().top - window.innerHeight * 0.35;
      var span = Math.max(1, max - start);
      var t = (y - start) / span;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      t = t * t * t;
      fadeCinza.style.opacity = String(t);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  document.querySelectorAll('[data-clone]').forEach(function (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  var floatHost = document.querySelector('.float-icons');
  if (floatHost) {
    var labels = [
      'Java', 'SQL', 'Spring Boot', 'C#', 'Electron', 'Git',
      'JavaScript', 'GitHub', 'Python', 'Node.js'
    ];
    for (var i = 0; i < 12; i++) {
      var el = document.createElement('span');
      el.className = 'fi';
      el.textContent = labels[i % labels.length];
      el.style.setProperty('--y', (8 + (i * 7) % 78) + '%');
      el.style.setProperty('--d', (i * -2.4) + 's');
      el.style.setProperty('--s', (18 + (i % 5) * 3) + 's');
      floatHost.appendChild(el);
    }
  }

  var canvas = document.getElementById('code-rain');
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext('2d');
    var cols = [];
    var chars = '{}[]()<>=;/*#&$01constletfnclassreturnawaitifelseHTMLCSSJSC#';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var count = Math.floor(canvas.width / 18);
      cols = [];
      for (var c = 0; c < count; c++) {
        cols.push({ y: Math.random() * canvas.height, speed: 1.2 + Math.random() * 2.4 });
      }
    }
    window.addEventListener('resize', resize);
    resize();

    function drawRain() {
      var dark = document.body.classList.contains('zona-dark');
      ctx.fillStyle = dark ? 'rgba(4, 2, 4, 0.28)' : 'rgba(9, 9, 11, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '13px Consolas, monospace';
      for (var i = 0; i < cols.length; i++) {
        var ch = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillStyle = dark ? (i % 5 === 0 ? '#7a1010' : '#3a0707') : (i % 7 === 0 ? '#ff8a80' : '#e53935');
        ctx.fillText(ch, i * 18, cols[i].y);
        cols[i].y += cols[i].speed * (dark ? 4 : 8);
        if (cols[i].y > canvas.height + 20) cols[i].y = -20;
      }
      requestAnimationFrame(drawRain);
    }
    drawRain();
  }

  var snippets = [
    'const dev = {\n  nome: "João Vitor",\n  role: "Software Engineer",\n  stack: ["HTML", "CSS", "JS"]\n};\n\nconsole.log(dev.nome);',
    'public class Program {\n  static void Main() {\n    var nome = "João Vitor";\n    Console.WriteLine(nome);\n  }\n}',
    'public class Main {\n  public static void main(String[] a) {\n    System.out.println("Hello, World");\n  }\n}',
    '.hero h1 {\n  color: #fff;\n  text-shadow: 0 0 24px #e53935;\n}\n\n.card:hover {\n  transform: rotateY(12deg);\n}'
  ];

  function loopType(pre, text) {
    var i = 0;
    var writing = true;
    function tick() {
      if (writing) {
        i += 1;
        pre.textContent = text.slice(0, i);
        if (i >= text.length) {
          writing = false;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 28);
      } else {
        i -= 2;
        if (i <= 0) {
          i = 0;
          writing = true;
          pre.textContent = '';
          setTimeout(tick, 400);
          return;
        }
        pre.textContent = text.slice(0, i);
        setTimeout(tick, 12);
      }
    }
    tick();
  }

  var bodies = document.querySelectorAll('.code-body[data-loop]');
  bodies.forEach(function (pre, idx) {
    if (reduce) {
      pre.textContent = snippets[idx % snippets.length];
      return;
    }
    setTimeout(function () {
      loopType(pre, snippets[idx % snippets.length]);
    }, idx * 400);
  });

  function setupTilt(el) {
    var inner = el.querySelector('.icon-3d-inner') || el;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      var rx = (0.5 - y) * 18;
      var ry = (x - 0.5) * 18;
      inner.style.webkitTransform =
        'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(10px)';
      inner.style.transform =
        'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(10px)';
    });
    el.addEventListener('mouseleave', function () {
      inner.style.webkitTransform = 'rotateX(0) rotateY(0) translateZ(0)';
      inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  }

  var canTilt = !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canTilt) {
    document.querySelectorAll('[data-tilt]').forEach(setupTilt);
  }

  var projetos = [
    {
      id: 'mist',
      letra: 'M',
      cor: 'c-mist',
      tema: 'tema-mist',
      titulo: 'Mist - Organize sua vida',
      desc: 'Aplicativo web de organização pessoal, reunindo finanças, calendários, anotações e acompanhamento em um só lugar.',
      detalhe: 'Aplicativo web de organização pessoal em desenvolvimento. Reúne finanças, calendários, anotações e acompanhamento em um só lugar, com front-end em HTML, CSS e JavaScript e back-end em Java com Spring Boot, API e banco SQL.',
      status: 'Em desenvolvimento',
      tags: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring Boot', 'API', 'SQL'],
      modulos: ['Finanças', 'Calendários', 'Anotações', 'Acompanhamento'],
      href: 'andamento.html'
    },
    {
      id: 'medclin',
      letra: 'C',
      cor: 'c-med',
      tema: 'tema-medclin',
      titulo: 'Medclin - Sistema de agendamento',
      desc: 'Sistema de gestão hospitalar em Electron, com agendamento de pacientes e controle de três unidades.',
      detalhe: 'Sistema de gestão hospitalar em desenvolvimento, feito com Electron. Cobre o gerenciamento de três unidades, com agendamento de pacientes, controle de acesso por perfil, gestão multifuncional e tela de inicialização.',
      status: 'Em desenvolvimento',
      tags: ['Electron', 'JavaScript', 'HTML', 'CSS'],
      modulos: ['Agendamento', 'Três unidades', 'Acesso por perfil', 'Tela inicial'],
      href: 'andamento.html'
    },
    {
      id: 'nexbank',
      letra: 'N',
      cor: 'c-bank',
      tema: 'tema-nexbank',
      titulo: 'Nexbank - Banco digital simulado',
      desc: 'Sistema bancário simulado em Java com Spring Boot, com contas, investimentos, cartão, fraude e câmbio.',
      detalhe: 'Sistema bancário simulado em desenvolvimento, em Java com Spring Boot. Reúne criação de contas, depósito, saque, transferências e extrato. Simula rendimento em CDB, poupança e Tesouro Direto com juros compostos e comparação entre os três. Cartão de crédito com limite, fatura, parcelamento e juros rotativo. Detecção de fraude com análise automática de valor alto e múltiplas transações em curto intervalo. Câmbio com conversão via API pública e histórico salvo no banco.',
      status: 'Em desenvolvimento',
      tags: ['Java', 'Spring Boot', 'Spring Data JPA', 'SQL', 'API REST'],
      modulos: ['Contas', 'Investimentos', 'Cartão de crédito', 'Fraude', 'Câmbio'],
      href: 'andamento.html'
    }
  ];

  var idx = 0;
  var timer = null;
  var showcase = document.querySelector('.projetos-showcase');

  function tagsHtml(list) {
    return list.map(function (t) { return '<span>' + t + '</span>'; }).join('');
  }

  function render(i, animate) {
    var atual = projetos[i];
    var prox = projetos[(i + 1) % projetos.length];
    var front = document.getElementById('stack-front');
    var cover = document.getElementById('stack-cover');
    var info = document.querySelector('.projetos-info');
    var peek = document.getElementById('proj-peek');
    if (!front) return;

    function apply() {
      var box = document.querySelector('.projetos-showcase');
      if (box) {
        box.classList.remove('tema-mist', 'tema-red', 'tema-medclin', 'tema-nexbank');
        if (atual.tema) box.classList.add(atual.tema);
      }
      cover.textContent = atual.letra;
      cover.className = 'stack-cover ' + atual.cor;
      document.getElementById('stack-title').textContent = atual.titulo;
      document.getElementById('stack-desc').textContent = atual.desc;
      document.getElementById('stack-tags').innerHTML = tagsHtml(atual.tags.slice(0, 2));
      document.getElementById('proj-title').textContent = atual.titulo;
      document.getElementById('proj-desc').textContent = atual.detalhe || atual.desc;
      var statusEl = document.getElementById('proj-status');
      if (statusEl) statusEl.textContent = atual.status || '';
      var mods = document.getElementById('proj-modulos');
      if (mods) {
        mods.innerHTML = (atual.modulos || []).map(function (m) {
          return '<li>' + m + '</li>';
        }).join('');
      }
      document.getElementById('proj-tags').innerHTML = tagsHtml(atual.tags);
      var link = document.getElementById('proj-link');
      link.href = atual.href;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      document.getElementById('peek-cover').textContent = prox.letra;
      document.getElementById('peek-cover').className = 'peek-cover ' + prox.cor;
      document.getElementById('peek-title').textContent = prox.titulo;
      document.getElementById('peek-desc').textContent = prox.desc;
      document.getElementById('peek-tags').innerHTML = tagsHtml(prox.tags.slice(0, 2));
    }

    if (animate && !reduce) {
      front.classList.add('sai');
      if (info) info.classList.add('sai');
      if (peek) peek.classList.add('sai');
      setTimeout(function () {
        apply();
        front.classList.remove('sai');
        front.classList.add('entra');
        if (info) { info.classList.remove('sai'); info.classList.add('entra'); }
        if (peek) { peek.classList.remove('sai'); peek.classList.add('entra'); }
        setTimeout(function () {
          front.classList.remove('entra');
          if (info) info.classList.remove('entra');
          if (peek) peek.classList.remove('entra');
        }, 700);
      }, 380);
    } else {
      apply();
    }
  }

  function restartBar() {
    var bar = document.getElementById('proj-bar');
    if (!bar) return;
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = reduce ? 'none' : 'projFill 20s linear forwards';
  }

  function goTo(n, animate) {
    idx = (n + projetos.length) % projetos.length;
    render(idx, animate);
    restartBar();
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      goTo(idx + 1, true);
    }, 20000);
  }

  if (showcase) {
    goTo(0, false);
    var nextBtn = document.getElementById('proj-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(idx + 1, true);
      });
    }
    var peekBox = document.getElementById('proj-peek');
    if (peekBox) {
      peekBox.addEventListener('click', function () {
        goTo(idx + 1, true);
      });
    }
  }

  document.querySelectorAll('[data-projeto]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var key = btn.getAttribute('data-projeto');
      var found = -1;
      for (var p = 0; p < projetos.length; p++) {
        if (projetos[p].id === key) found = p;
      }
      if (found < 0) return;
      e.preventDefault();
      goTo(found, true);
      var alvo = document.getElementById('projetos');
      if (alvo) alvo.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  });

  if (reduce) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visivel');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visivel');
      if (entry.target.classList.contains('painel-idiomas')) {
        entry.target.querySelectorAll('.circulo[data-percent]').forEach(function (el) {
          var target = parseFloat(el.getAttribute('data-percent')) || 0;
          var start = performance.now();
          function frame(now) {
            var t = Math.min(1, (now - start) / 1200);
            var eased = 1 - Math.pow(1 - t, 3);
            el.style.setProperty('--p', (target * eased) + '%');
            if (t < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        });
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
