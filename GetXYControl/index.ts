import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class GetXYControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  /** ADDstart */
  private _notifyOutputChanged: () => void;

  private _context: ComponentFramework.Context<IInputs>;
  private _refreshData: EventListenerOrEventListenerObject;

  private _container: HTMLDivElement;
  private targetDivElement: HTMLDivElement;

  private _offsetX: number;
  private _offsetY: number;
  private _display: boolean;

  public refreshData(evt: Event): void {
    //console.log("call_refreshData");
    this._offsetX = (evt as MouseEvent).offsetX as number;
    this._offsetY = (evt as MouseEvent).offsetY as number;
    this._notifyOutputChanged();
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
    this._refreshData = this.refreshData.bind(this);

    this._context = context;
    this._container = document.createElement("div");

    this.targetDivElement = document.createElement("div");

    this._container.appendChild(this.targetDivElement);
    container.appendChild(this._container);

    this._display = context.parameters.display.raw!;
    //console.log(context.parameters.display);
    this.targetDivElement.setAttribute("class",
    this._display
        ? "TargetRect"
        : "TargetRectTransparent"
    );

    this.targetDivElement.addEventListener("click", this._refreshData);
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
    this.targetDivElement.style.setProperty("height", this._context.mode.allocatedHeight.toString() + "px");
    this.targetDivElement.style.setProperty("width", this._context.mode.allocatedWidth.toString() + "px");

    this._display = context.parameters.display.raw!;
    //console.log("displayvalue",context.parameters.display);
    this.targetDivElement.setAttribute("class",
    this._display
        ? "TargetRect"
        : "TargetRectTransparent"
    );
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
      display: this._display
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
    this.targetDivElement.removeEventListener("click", this._refreshData);
    /** ADDend */
  }
}
