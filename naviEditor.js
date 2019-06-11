/**
 * Navi - Editor
 * @author Navin
 */

const ne = function(expectedTextareaId) {
  this.actualtextareaId = document.getElementById(expectedTextareaId);

  /** Warn if the text area ID is not found in the HTML Page */
  if (this.actualtextareaId === null) {
    console.warn(`Textarea not found with ID "${expectedTextareaId}"`);
    return this;
  }

  /**
   * All the Editor Tools
   */
  this.tools = [
    "header",
    "picture",
    "list",
    "quote",
    "code",
    "twitter",
    "instagram",
    "smile"
  ];
  this.toolbarOpened = false;
  this.toolbarButtonToggle = "toolbar-toggled";

  /**
   * Key Combinations
   */
  this.key = {
    TAB: 9,
    ENTER: 13,
    BACKSPACE: 8,
    DELETE: 46,
    DOWN: 40,
    SPACE: 32,
    ESC: 27,
    CTRL: 17,
    META: 91,
    SHIFT: 16,
    ALT: 18
  };

  /**
   * Making a wrapper and interface
   */
  this.makeInterface();

  /**
   * Bind all events
   */
  this.bindEvents();
};

/**
 * Editor interface drawing
 * @use this.tools to get necessary items
 * @todo get tools from user inital-settings
 */
ne.prototype.makeInterface = function() {
  const wrapper = this.make.editorWrapper();
  const firstNode = this.make.node(
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro quia nihil repellendus aut cupiditate reprehenderit sapiente magnam nobis doloremque eaque! Sint nobis assumenda nisi ducimus minima illo tenetur, cumque facilis."
  );
  const toolbar = this.make.toolbar();
  let button;

  for (let i = 0; i < this.tools.length; i++) {
    button = this.make.toolbarButton(this.tools[i]);
    toolbar.appendChild(button);
  }

  /**
   * Add toolbar to node
   * @todo make toolbar rendering once
   */
  firstNode.appendChild(toolbar);

  /** Add first node */
  wrapper.appendChild(firstNode);

  /** Insert Editor after initial textarea. Hide textarea */
  this.actualtextareaId.parentNode.insertBefore(
    wrapper,
    this.actualtextareaId.nextSibling
  );
  this.actualtextareaId.hidden = true;

  /** Set auto focus */
  const contentEditable = firstNode.getElementsByClassName("ne-node-content");
  contentEditable.length && contentEditable[0].focus();
};

/**
 * All events binds in one place
 */
ne.prototype.bindEvents = function() {
  const _this = this;

  /** All keydowns on Window */
  window.addEventListener(
    "keydown",
    function(event) {
      _this.globalKeydownCallback(event);
    },
    false
  );

  /**
   * All window keydowns handles here
   */
  ne.prototype.globalKeydownCallback = function(event) {
    switch (event.keyCode) {
      case this.key.TAB:
        this.tabKeyPressed(event);
        break; // TAB
      case this.key.ENTER:
        this.enterKeyPressed(event);
        break; // Enter
    }
  };
};

/**
 * @todo: check if currently focused in contenteditable element
 */
ne.prototype.tabKeyPressed = function(event) {
  const toolbar = document.getElementsByClassName("add-buttons");

  if (!toolbar[0].className.includes(this.toolbarButtonToggle)) {
    toolbar[0].className += " " + this.toolbarButtonToggle;
    this.toolbarOpened = true;
  } else {
    toolbar[0].className = toolbar[0].className.replace(
      this.toolbarButtonToggle,
      ""
    );
    this.toolbarOpened = false;
  }

  event.preventDefault();
};

/**
 * Handle Enter key. Adds new Node;
 */

ne.prototype.enterKeyPressed = function(event) {
  console.log("Enter key pressed");
};

/**
 * Creates HTML elements
 */
ne.prototype.make = (function() {
  function toolbar() {
    const bar = document.createElement("div");

    bar.className += "add-buttons";

    /** Toggler button*/
    bar.innerHTML =
      '<span class="toggler">' +
      '<i class="ne_icon-plus-circled-1"></i>' +
      "</span>";

    return bar;
  }

  function toolbarButton(type) {
    const button = document.createElement("button");

    button.dataset.type = type;
    button.innerHTML = '<i class="ne_icon-' + type + '"></i>';

    return button;
  }

  /**
   * Paragraph node
   * @todo set unique id with prefix
   */
  function node(content) {
    const node = document.createElement("div");

    node.className += "node";
    node.innerHTML =
      '<p class="ne-node-content" contenteditable="true">' +
      (content || "") +
      "</p>";

    return node;
  }

  function editorWrapper() {
    const wrapper = document.createElement("div");

    wrapper.className += "navi-editor";

    return wrapper;
  }

  const neMake = function() {
    this.toolbar = toolbar;
    this.toolbarButton = toolbarButton;
    this.node = node;
    this.editorWrapper = editorWrapper;
  };

  return new neMake();
})();
