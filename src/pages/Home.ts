import { SpanElement, H1Element, H2Element, ParagraphElement, ButtonElement, DivElement, VBox, HBox, CodeElement, AnchorElement, BorderPanel, Router } from "typecomposer";
import "highlight.js/styles/atom-one-dark.css";
import { NavBar } from "@/components/navbar/NavBar";
import { CopyButton } from "@/components/ui/CopyButton";
import { BuiltWithTypeCompose } from "@/components/ui/Made";
import { Sidebar } from "@/components/sidebar/Sidebar";

export class HomePage extends BorderPanel {
  constructor() {
    super({
      className: "w-screen h-screen",
    });
    this.top = new NavBar();
    this.left = new Sidebar({ style: { display: "none" } });
    this.center = this.buildLandingPage();
  }

  private buildLandingPage(): HTMLElement {
    // Hero Section
    const heroSection = new VBox({
      className: "relative text-center pt-32 pb-16 px-6 overflow-hidden min-h-screen flex items-center justify-center",
      style: {
        alignItems: "center",
        gap: "3rem",
        backgroundColor: "var(--primary-background-color)",
        background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, var(--accent-color)15, transparent),
            radial-gradient(ellipse 120% 120% at 80% 60%, var(--accent-color)10, transparent),
            radial-gradient(ellipse 120% 100% at 20% 80%, var(--accent-color)10, transparent),
            var(--primary-background-color)
          `,
      },
    });

    // Animated background decoration
    const heroDecoration = new DivElement({
      className: "absolute inset-0 -z-10",
      style: {
        background: `
            radial-gradient(circle at 30% 60%, var(--accent-color)20 0%, transparent 60%),
            radial-gradient(circle at 70% 40%, var(--accent-color)15 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, var(--accent-color)10 0%, transparent 60%)
          `,
        animation: "float 25s ease-in-out infinite alternate",
        filter: "blur(1px)",
      },
    });
    heroSection.appendChild(heroDecoration);

    const titleContainer = new VBox({
      className: "relative z-10",
      style: {
        alignItems: "center",
        gap: "1.5rem",
      },
    });

    const title = new H1Element({
      text: "TypeComposer",
      className: "font-black mb-2 tracking-tight animate-fade-in-up",
      style: {
        fontSize: "clamp(2.5rem, 8vw, 6rem)",
        background: "linear-gradient(135deg, var(--text-primary), var(--accent-color), var(--accent-hover))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 0 40px var(--accent-color)30",
        filter: "drop-shadow(0 4px 20px var(--text-primary)10)",
      },
    });

    const subtitle = new H2Element({
      text: "The Zero HTML Framework",
      className: "text-2xl md:text-4xl font-bold mb-8 tracking-wide animate-fade-in-up",
      style: {
        color: "var(--text-primary)",
        animationDelay: "0.2s",
        textShadow: "0 2px 10px var(--text-primary)10",
      },
    });

    const description = new ParagraphElement({
      text: "Build modern web interfaces without touching a single line of HTML. TypeComposer lets you create interactive, scalable, and beautiful UIs using only TypeScript while staying fully compatible with web standards.",
      className: "text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed font-medium animate-fade-in-up",
      style: {
        color: "var(--text-secondary)",
        animationDelay: "0.4s",
        lineHeight: "1.7",
      },
    });

    // Hero CTA buttons
    const heroActions = new HBox({
      className: "mt-16 flex flex-col sm:flex-row gap-8 animate-fade-in-up hero-actions",
      style: {
        alignItems: "center",
        justifyContent: "center",
        animationDelay: "0.6s",
      },
    });

    const primaryButton = new ButtonElement({
      text: "Get Started",
      className:
        "px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[0_20px_50px_var(--accent-color)40] transform hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden",
      style: {
        background: "linear-gradient(135deg, var(--accent-color), var(--accent-hover))",
        color: "white",
        border: "1px solid var(--text-primary)20",
        position: "relative",
        backgroundSize: "200% 200%",
        animation: "gradient-shift 4s ease infinite",
      },
    });

    // Add shimmer effect to primary button
    const buttonShimmer = new DivElement({
      className:
        "absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-var(--text-primary)/20 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer",
      style: {
        background: "linear-gradient(90deg, transparent, var(--text-primary)40, transparent)",
        animation: "shimmer 2s infinite",
      },
    });
    primaryButton.appendChild(buttonShimmer);

    const secondaryButton = new ButtonElement({
      text: "Documentation",
      className: "px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 backdrop-blur-xl group relative overflow-hidden",
      style: {
        background: "var(--text-primary)05",
        color: "var(--text-primary)",
        border: "2px solid var(--border-color)",
        backdropFilter: "blur(20px)",
        boxShadow: "inset 0 1px 0 var(--text-primary)10, 0 10px 30px var(--text-primary)30",
      },
    });

    primaryButton.onclick = () => {
      // Scroll to the quick start section
      const quickStartElement = document.getElementById("quick-start-section");
      if (quickStartElement) {
        quickStartElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    secondaryButton.onclick = () => {
      Router.go("/docs");
    };

    heroActions.append(primaryButton, secondaryButton);
    titleContainer.append(title, subtitle, description, heroActions);
    heroSection.appendChild(titleContainer);

    // Features Section
    const featuresSection = new VBox({
      className: "pt-5 pb-32 px-6 relative",
      style: {
        alignItems: "center",
        gap: "5rem",
        background: "linear-gradient(180deg, var(--primary-background-color) 0%, var(--secondary-background-color) 50%, var(--primary-background-color) 100%)",
      },
    });

    const featuresTitle = new H2Element({
      text: "Why Choose TypeComposer?",
      className: "text-5xl md:text-6xl font-bold text-center mb-6 animate-fade-in-up",
      style: {
        background: "linear-gradient(135deg, var(--text-primary), var(--accent-color))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 0 20px var(--accent-color)30",
      },
    });

    const featuresGrid = new DivElement({
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto animate-fade-in-up",
      style: {
        animationDelay: "0.4s",
      },
    });

    const features = [
      {
        emoji: "🚀",
        title: "No HTML",
        description: "Define your entire UI using clean, intuitive TypeScript classes.",
        gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
      },
      {
        emoji: "💎",
        title: "Clean & Declarative",
        description: "Build complex layouts with simple, readable code that's easy to maintain and understand.",
        gradient: "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(255, 58, 212, 0.1))",
      },
      {
        emoji: "🔷",
        title: "TypeScript Native",
        description: "Full type safety, intelligent autocomplete, and modern tooling support out of the box.",
        gradient: "linear-gradient(135deg, rgba(255, 58, 212, 0.1), rgba(59, 130, 246, 0.1))",
      },
      {
        emoji: "⚛️",
        title: "React-Friendly",
        description: "Easily integrate React components into TypeComposer applications for maximum flexibility.",
        gradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(120, 119, 198, 0.1))",
      },
      {
        emoji: "🎨",
        title: "Style Your Way",
        description: "Use CSS-in-JS, Tailwind, or plain CSS. Complete flexibility in your styling approach.",
        gradient: "linear-gradient(135deg, rgba(120, 119, 198, 0.1), rgba(147, 51, 234, 0.1))",
      },
      {
        emoji: "⚡",
        title: "Lightning Fast",
        description: "Minimal runtime overhead with tree-shaking support for optimal bundle sizes.",
        gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(14, 165, 233, 0.1))",
      },
    ];

    features.forEach((feature, index) => {
      const featureCard = new VBox({
        className: "group p-10 rounded-3xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 relative overflow-hidden cursor-pointer",
        style: {
          alignItems: "center",
          gap: "2rem",
          animationDelay: `${index * 0.15}s`,
          background: `
              ${feature.gradient},
              var(--hover-background)
            `,
          border: "1px solid var(--border-color)",
          backdropFilter: "blur(20px)",
          boxShadow: `
              inset 0 1px 0 var(--text-primary)10,
              0 10px 30px var(--text-primary)30,
              0 0 0 1px var(--text-primary)05
            `,
        },
      });

      // Card hover glow effect
      const cardGlow = new DivElement({
        className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10",
        style: {
          background: feature.gradient,
          filter: "blur(20px)",
          transform: "scale(1.1)",
        },
      });
      featureCard.appendChild(cardGlow);

      const emojiContainer = new DivElement({
        className:
          "w-24 h-24 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl relative overflow-hidden",
        style: {
          background: "linear-gradient(135deg, var(--accent-color), var(--accent-hover))",
          border: "1px solid var(--text-primary)20",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px var(--accent-color)30",
        },
      });

      const emoji = new SpanElement({
        text: feature.emoji,
        className: "text-4xl filter drop-shadow-lg relative z-10",
      });

      const featureTitle = new H2Element({
        text: feature.title,
        className: "text-2xl font-bold text-center group-hover:scale-105 transition-all duration-500",
        style: {
          color: "var(--text-primary)",
          textShadow: "0 2px 10px var(--text-primary)10",
        },
      });

      const featureDesc = new ParagraphElement({
        text: feature.description,
        className: "text-center leading-relaxed group-hover:text-slate-200 transition-all duration-500",
        style: {
          color: "var(--text-secondary)",
          lineHeight: "1.7",
        },
      });

      emojiContainer.appendChild(emoji);
      featureCard.append(emojiContainer, featureTitle, featureDesc);
      featuresGrid.appendChild(featureCard);
    });

    featuresSection.append(featuresTitle, featuresGrid);

    // Quick Start Section
    const quickStartSection = new VBox({
      className: "py-32 px-6 relative overflow-hidden",
      id: "quick-start-section",
      style: {
        alignItems: "center",
        gap: "4rem",
        background: `
            radial-gradient(ellipse 100% 60% at 50% 20%, rgba(59, 130, 246, 0.1), transparent),
            radial-gradient(ellipse 80% 40% at 20% 80%, rgba(59, 130, 246, 0.05), transparent),
            linear-gradient(180deg, var(--primary-background-color) 0%, var(--secondary-background-color) 100%)
          `,
      },
    });

    // Enhanced background pattern
    const quickStartBg = new DivElement({
      className: "absolute inset-0 opacity-30",
      style: {
        background: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
          `,
        animation: "pulse-glow 8s ease-in-out infinite alternate",
      },
    });
    quickStartSection.appendChild(quickStartBg);

    const quickStartContent = new VBox({
      className: "relative z-10",
      style: {
        alignItems: "center",
        gap: "3rem",
      },
    });

    const quickStartTitle = new H2Element({
      text: "Get Started in Seconds",
      className: "text-5xl md:text-6xl font-bold text-center mb-6 animate-fade-in-up",
      style: {
        background: "linear-gradient(135deg, var(--text-primary), var(--accent-color), var(--accent-hover))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
      },
    });

    const quickStartDesc = new ParagraphElement({
      text: "No complex setup. Run one command and start building beautiful interfaces.",
      className: "text-xl text-center max-w-3xl animate-fade-in-up",
      style: {
        color: "var(--text-secondary)",
        animationDelay: "0.2s",
        lineHeight: "1.6",
      },
    });

    const codeBlock = new DivElement({
      className:
        "backdrop-blur-xl p-10 rounded-3xl font-mono text-lg shadow-2xl hover:shadow-[0_20px_50px_rgba(120,119,198,0.3)] transition-all duration-700 group-hover:scale-105 relative overflow-hidden",
      style: {
        background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(120, 119, 198, 0.1)),
            var(--code-background)
          `,
        border: "1px solid var(--border-color)",
        backdropFilter: "blur(30px)",
        boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.4)
          `,
      },
    });

    // Terminal header
    const terminalHeader = new DivElement({
      className: "flex items-center gap-2 mb-6",
    });

    const terminalDots = ["#ff5f57", "#ffbd2e", "#28ca42"].map((color) => {
      return new DivElement({
        className: "w-3 h-3 rounded-full",
        style: { backgroundColor: color },
      });
    });

    const terminalTitle = new SpanElement({
      text: "Terminal",
      className: "text-sm font-semibold ml-4",
      style: { color: "var(--text-muted)" },
    });

    terminalHeader.append(...terminalDots, terminalTitle);

    const codeTextContainer = new DivElement({
      className: "flex items-center justify-between gap-4",
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      },
    });

    const codeText = new CodeElement({
      text: "$ npm create typecomposer",
      className: "text-xl flex-1",
      style: {
        color: "var(--text-primary)",
      },
    });

    const copyButton = new CopyButton({
      content: "npm create typecomposer",
      size: "md",
    });

    copyButton.className += " opacity-70 hover:opacity-100 flex-shrink-0";

    codeTextContainer.append(codeText, copyButton);
    codeBlock.append(terminalHeader, codeTextContainer);
    quickStartContent.append(quickStartTitle, quickStartDesc, codeBlock);
    quickStartSection.appendChild(quickStartContent);

    // Footer
    const footer = new VBox({
      className: "py-24 px-6 relative",
      style: {
        alignItems: "center",
      },
    });

    const madeWithBadge = new BuiltWithTypeCompose({
      className: "fixed bottom-6 right-6 z-50",
    });
    footer.appendChild(madeWithBadge);

    const footerContent = new VBox({
      className: "text-center max-w-4xl",
      style: {
        alignItems: "center",
        gap: "2rem",
      },
    });

    const footerText = new ParagraphElement({
      text: "Built with ❤️ by developers, for developers.",
      className: "leading-relaxed text-lg",
      style: {
        color: "var(--text-secondary)",
        lineHeight: "1.7",
      },
    });

    const footerLinks = new HBox({
      className: "flex flex-wrap gap-8 text-sm mt-8",
      style: {
        justifyContent: "center",
      },
    });

    const footerLinkData = [
      { text: "Documentation", href: "/#/docs" },
      { text: "GitHub", href: "https://github.com/typecomposer/typecomposer" },
      { text: "NPM Package", href: "https://www.npmjs.com/package/typecomposer" },
    ];

    footerLinkData.forEach((linkData) => {
      const link = new AnchorElement({
        text: linkData.text,
        href: linkData.href,
        className: "font-semibold px-4 py-2 rounded-lg hover:bg-accent hover:text-white",
        style: {
          color: "var(--text-muted)",
        },
      });
      footerLinks.appendChild(link);
    });

    footerContent.append(footerText, footerLinks);
    footer.appendChild(footerContent);

    // Create main container
    const mainContainer = new VBox({
      className: "w-full overflow-y-auto",
      style: {
        alignItems: "stretch",
      },
    });

    mainContainer.append(heroSection, featuresSection, quickStartSection, footer);

    return mainContainer;
  }
}
