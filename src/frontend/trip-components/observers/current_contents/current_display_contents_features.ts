import { ContentCard } from "../../../../types/content_card.types";
import CurrentDisplayContents from "./current_display_contents_observer";

type FeatureTypes = "timestamp" | "days" | "events" | "city";

class LocationBaseContentsNode {
  private _nextEvent: LocationBaseContentsNode = null;
  private _previousEvent: LocationBaseContentsNode = null;
  private _parent: LocationBaseContentsNode = null;
  private _child: LocationBaseContentsNode = null;
  private _contents: ContentCard[] = [];
  public name: string;
  public id: number;
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  nextEvent(node: LocationBaseContentsNode) {
    this._nextEvent = node;
  }

  previousEvent(node: LocationBaseContentsNode) {
    this._previousEvent = node;
  }

  parent(node: LocationBaseContentsNode) {
    this._parent = node;
  }

  child(node: LocationBaseContentsNode) {
    this._child = node;
  }

  getNextEvent() {
    return this._nextEvent;
  }
  getPreviousEvent() {
    return this._previousEvent;
  }

  getParent() {
    return this._parent;
  }
  getChild() {
    return this._child;
  }

  getContents() {
    return this._contents ?? [];
  }

  setContents(contents: ContentCard[]) {
    this._contents = contents;
  }

  pushContent(content: ContentCard) {
    this._contents.push(content);
  }
}
class LocationBaseContentsGraph {
  private _eventHead: LocationBaseContentsNode = null;
  private _eventTail: LocationBaseContentsNode = null;
  private _locaionTree: Map<string, LocationBaseContentsNode> = new Map();
  private _displayList: ContentCard[] = [];
  private _eventsMap: Map<number, ContentCard[]> = new Map();
  private _locationsMap: Map<string, ContentCard[]> = new Map();

  insertIntoLocationTree(name: string, node: LocationBaseContentsNode) {
    let existing_node = this._locaionTree.get(name);

    if (!existing_node) {
      // if a first node in the tree, create the node and put it to map
      this._locaionTree.set(name, node);
      return;
    }
    // get the last node of tree
    while (existing_node.getChild() !== null) {
      existing_node = existing_node.getChild();
    }
    existing_node.child(node);
    node.parent(existing_node);
    return;
  }

  findBelongNode(name: string) {
    // if not exist, create new node
    if (!this._eventHead) {
      const head = new LocationBaseContentsNode(name, 1);
      this._eventHead = head;
      this._eventTail = head;
      return head;
    }
    let start = this._eventHead;
    let lastNode: LocationBaseContentsNode = null;
    // get the last 'name' node

    while (start) {
      if (start.name === name) {
        lastNode = start;
      }
      start = start.getNextEvent();
    }
    // if the node is the last one return
    if (lastNode === this._eventTail) {
      return lastNode;
    }
    // if not the last node, create new one with id = lastNode.id =1
    let new_id = 1;
    if (lastNode) {
      new_id = lastNode.id + 1;
    }
    const new_node = new LocationBaseContentsNode(name, new_id);
    //add to graph
    new_node.previousEvent(this._eventTail);
    this._eventTail.nextEvent(new_node);
    this._eventTail = new_node;
    this.insertIntoLocationTree(name, new_node);
    return new_node;
  }

  setContentList(cards: ContentCard[]) {
    cards.forEach((card) => {
      const city = card.city;
      //get node
      const node = this.findBelongNode(city);
      //push card into node
      node.pushContent(card);
    });
  }
  generateContentList(cards: ContentCard[]) {
    let previousCard = null;
    let event = 0;
    //loop
    for (let i = 0; i < cards.length; i++) {
      // set current card
      let currentCard = cards[i];

      //if the start of a new event, increase the event var
      //push into events map
      if (currentCard.city !== previousCard?.city) {
        event++;
        this._eventsMap.set(event, []);
      }
      currentCard.render_event_id = event;
      // push into render list
      this._displayList.push(currentCard);
      let current_event_array = this._eventsMap.get(event);
      current_event_array.push(currentCard);

      // push in to the location map
      let location_array = this._locationsMap.get(currentCard.city);
      if (!location_array || location_array.length <= 0) {
        this._locationsMap.set(currentCard.city, []);
        location_array = this._locationsMap.get(currentCard.city);
      }
      location_array.push(currentCard);

      // set previous card = current card
      previousCard = currentCard;
    }
    return {
      event: this._eventsMap,
      location: this._locationsMap,
      display: this._displayList,
    };
  }
  addContentToList(card: ContentCard) {
    const city = card.city;
    //get node
    const node = this.findBelongNode(city);
    console.log(node);
    //push card into node
    node.pushContent(card);
  }
  getContentByEvent() {
    let result = [];
    let temp = this._eventHead;
    if (!temp) return null;
    let i = 0;
    while (temp) {
      console.log(i);
      result.push(temp.getContents());
      temp = temp.getNextEvent();
      i++;
    }
    return result;
  }
  getContentByLocation(name: string) {
    let result = [];
    let temp = this._locaionTree.get(name);
    if (!temp) return null;
    while (temp.getChild() !== null) {
      result = [result, ...temp.getContents()];
      temp = temp.getChild();
    }
    return result;
  }
  getEventTree() {
    let temp = this._eventHead;
    let result = [];
    while (temp) {
      result.push(temp);
      temp = temp.getNextEvent();
    }
    return result;
  }
}

interface ContentCardsFeatures {
  timestamp: Array<ContentCard[]>;
  events: Map<number, ContentCard[]>;
  display: Array<ContentCard>;
  // location: Array<ContentCard[]>;
}
interface Observer {
  update: (value: ContentCardsFeatures) => void;
}
class ContentsDisplayFeatures {
  private _ContentLocationGraph: LocationBaseContentsGraph = null;
  private _ContentCards: ContentCard[] = [];

  generateContentsFeatures(contents: ContentCard[]): ContentCardsFeatures {
    try {
      if (contents.length <= 0) return null;
      let sorted_cards = contents.sort((a, b) => a.time_stamp - b.time_stamp);
      // console.log("new asset", sorted_cards);
      this._ContentLocationGraph = new LocationBaseContentsGraph();

      const result =
        this._ContentLocationGraph.generateContentList(sorted_cards);
      // console.log("event log", this._ContentLocationGraph.getEventTree());

      // console.log("event comntents", cards_by_event);
      return {
        timestamp: [sorted_cards],
        events: result.event,
        display: result.display,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export { LocationBaseContentsGraph };
export default ContentsDisplayFeatures;
