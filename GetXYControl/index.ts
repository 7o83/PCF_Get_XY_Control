import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class GetXYControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  /** ADDstart */
  private _notifyOutputChanged: () => void;

  private _context: ComponentFramework.Context<IInputs>;
  private _refreshDataOnClick: EventListenerOrEventListenerObject;
  private _refreshDataOnDrag: EventListenerOrEventListenerObject;
  private _refreshEventListener: Function;

  private _container: HTMLDivElement;
  private targetDivElement: HTMLDivElement;

  private _offsetX: number;
  private _offsetY: number;
  private _display: boolean;
  private _mode: string;
  private _dragging: boolean;
  private _updateInterval: number;

  private _intervalId: number;
  private _beforeMode: string;

  public refreshDataOnClick(evt: Event): void {
    //console.log("call_refreshDataOnClick");
    this._offsetX = (evt as MouseEvent).offsetX;
    this._offsetY = (evt as MouseEvent).offsetY;
    this._notifyOutputChanged();
  }

  public refreshDataOnDrag(evt: Event): void {
    //console.log("call_refreshDataOnDrag");
    const targetRect = this.targetDivElement.getBoundingClientRect();

    switch (evt.type) {
      case "mousedown":
      case "mousemove":
      case "mouseup":
      case "mouseleave":
        this._offsetX = (evt as MouseEvent).offsetX;
        this._offsetY = (evt as MouseEvent).offsetY;
        break;

      case "touchstart":
      case "touchmove":
      case "touchend":
        this._offsetX = (evt as TouchEvent).changedTouches[0].clientX - targetRect.left;
        this._offsetY = (evt as TouchEvent).changedTouches[0].clientY - targetRect.top;
        break;

    }

    switch (evt.type) {
      case "mousedown":
      case "touchstart":
        evt.preventDefault();
        this._dragging = true;
        this._notifyOutputChanged();
        this._intervalId = window.setInterval(this._notifyOutputChanged, this._updateInterval);

        this.targetDivElement.addEventListener("mousemove", this._refreshDataOnDrag, { passive: false });
        this.targetDivElement.addEventListener("touchmove", this._refreshDataOnDrag, { passive: false });
        this.targetDivElement.addEventListener("mouseup", this._refreshDataOnDrag, { passive: false });
        this.targetDivElement.addEventListener("mouseleave", this._refreshDataOnDrag, { passive: false });
        this.targetDivElement.addEventListener("touchend", this._refreshDataOnDrag, { passive: false });
        break;

      case "mousemove":
      case "touchmove":
        break;

      case "mouseup":
      case "touchend":
      case "mouseleave":
        this._dragging = false;
        this._notifyOutputChanged();
        clearInterval(this._intervalId);
        this._intervalId = 0;

        this.targetDivElement.removeEventListener("mousemove", this._refreshDataOnDrag);
        this.targetDivElement.removeEventListener("touchmove", this._refreshDataOnDrag);
        this.targetDivElement.removeEventListener("mouseup", this._refreshDataOnDrag);
        this.targetDivElement.removeEventListener("mouseleave", this._refreshDataOnDrag);
        this.targetDivElement.removeEventListener("touchend", this._refreshDataOnDrag);
        break;

    }
  }

  public refreshEventListener(): void {
    //console.log("call_refreshEventListener");
    switch (this._mode) {
      case "0":
        this.targetDivElement.removeEventListener("mousedown", this._refreshDataOnDrag);
        this.targetDivElement.removeEventListener("touchstart", this._refreshDataOnDrag);

        this.targetDivElement.addEventListener("click", this._refreshDataOnClick, false);
        break;

      case "1":
        this.targetDivElement.removeEventListener("click", this._refreshDataOnClick);

        this.targetDivElement.addEventListener("mousedown", this._refreshDataOnDrag, { passive: false });
        this.targetDivElement.addEventListener("touchstart", this._refreshDataOnDrag, { passive: false });
        break;

    }
  }
  /** ADDend */

  /**
   * Empty constructor.
   */
  constructor() {

  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
    // Add control initialization code
    /** ADDstart */
    //console.log("call_init");
    context.mode.trackContainerResize(true);

    this._notifyOutputChanged = notifyOutputChanged;
    this._refreshDataOnClick = this.refreshDataOnClick.bind(this);
    this._refreshDataOnDrag = this.refreshDataOnDrag.bind(this);
    this._refreshEventListener = this.refreshEventListener;

    this._context = context;
    this._container = document.createElement("div");

    this.targetDivElement = document.createElement("div");

    this._container.appendChild(this.targetDivElement);
    container.appendChild(this._container);

    this._display = context.parameters.display.raw!;
    this.targetDivElement.setAttribute("class",
      this._display
        ? "TargetRect"
        : "TargetRectTransparent"
    );

    this._dragging = false;
    this._mode = context.parameters.mode.raw!;
    this._updateInterval = context.parameters.updateInterval.raw!;
    this._refreshEventListener();
    /** ADDend */
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
    /** ADDstart */
    //console.log("call_update");
    this.targetDivElement.style.setProperty("height", (this._context.mode.allocatedHeight.toString() || "0") + "px");
    this.targetDivElement.style.setProperty("width", (this._context.mode.allocatedWidth.toString() || "0") + "px");
    this._display = context.parameters.display.raw!;
    this.targetDivElement.setAttribute("class",
      this._display
        ? "TargetRect"
        : "TargetRectTransparent"
    );
    this._beforeMode = this._mode;
    this._mode = context.parameters.mode.raw!;
    this._updateInterval = context.parameters.updateInterval.raw!;
    if (this._beforeMode != this._mode) {
      this._dragging = false;
      this._refreshEventListener();
    }
    /** ADDend */
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    //console.log("call_output");
    return {
      /** ADDstart */
      offsetX: this._offsetX,
      offsetY: this._offsetY,
      display: this._display,
      mode: this._mode,
      dragging: this._dragging,
      updateInterval: this._updateInterval
      /** ADDend */
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    /** ADDstart */
    //console.log("call_destoroy");
    this.targetDivElement.removeEventListener("click", this._refreshDataOnClick);
    this.targetDivElement.removeEventListener("mousedown", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("touchstart", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("mousemove", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("touchmove", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("mouseup", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("mouseleave", this._refreshDataOnDrag);
    this.targetDivElement.removeEventListener("touchend", this._refreshDataOnDrag);
    /** ADDend */
  }
}
