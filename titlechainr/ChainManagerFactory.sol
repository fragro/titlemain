contract LinkedList {

  struct Element {
    //Linked List Functions
    address uid;
    address previous;
    address next;
  }

  // Make these public.
  uint public size;
  address public tail;
  address public head;
  mapping(address => Element) elements;

  function getNext(address key) returns (address) {
    Element elem = elements[key];
    return elem.next;
  }
  function getPrev(address key) returns (address) {
    Element elem = elements[key];
    return elem.previous;
  }
  function addElement(address key) returns (bool){
    Element elem = elements[key];
    // Check that the key is not already taken. We have no null-check for structs atm., so
    // we need to check the fields inside the structs to verify. This works if the field we
    // check is not allowed to be null (which would be 0 or 0x0 in the case of addresses).
    elem.uid = key;

    // Two cases - empty or not.
    if(size == 0){
      tail = key;
      head = key;
    } else {
      // Link
      elements[head].next = key;
      elem.previous = head;
      // Set this element as the new head.
      head = key;
    }
    // Regardless of case, increase the size of the list by one.
    size++;
    return true;
  }

  function removeElement(address key) returns (bool result) {

       Element elem = elements[key];

      // If no element - return false. Nothing to remove.
      if(elem.uid == 0x0){
        return false;
      }

    // If this is the only element.
      if(size == 1){
        tail = 0x0;
        head = 0x0;
      // If this is the head.
      } else if (key == head){
        // Set this ones 'previous' to be the new head, then change its
        // next to be null (used to be this one).
        head = elem.previous;
        elements[head].next = 0x0;
      // If this one is the tail.
      } else if(key == tail){
        tail = elem.next;
        elements[tail].previous = 0x0;
      // Now it's a bit tougher. Getting here means the list has at least 3 elements,
      // and this element must have both a 'previous' and a 'next'.
      } else {
        address prevElem = elem.previous;
        address nextElem = elem.next;
        elements[prevElem].next = nextElem;
        elements[nextElem].previous = prevElem;
      }
      // Regardless of case, we will decrease the list size by 1, and delete the actual entry.
      size--;
      delete elements[key];
      return true;
  }
}

contract Title {
  //title Contents
  string public description;

  /* function getElement(address key) constant returns (Element){
    return elements[key];
  } */

  function initTitle(string description_){
    description = description_;
  }
}

contract TitleChain is LinkedList{

  string public description;

  function TitleChain(string description_){
    description = description_;
  }
  /*Returns the TitleChain associated with this address*/
  function getPrevTitle(address key) returns (address){
    return getPrev(key);
  }
  /*Returns the TitleChain associated with this address*/
  function getNextTitle(address key) returns (address){
    return getNext(key);
  }
  function putTitle(string description_) returns (address){
    address newKey;
    bool ret;
    newKey = createTitle(description_);
    ret = addElement(newKey);
    return newKey;
  }
  function createTitle(string description_) returns (address){
    Title t = new Title();
    t.initTitle(description_);
    return t;
  }
}
contract ChainManager is LinkedList{
  mapping(address => address) titleChains;

  event NewTitleChain(address user, address titleChain);

  /*Returns the TitleChain associated with this address*/
  function getPrevTitleChain(address key) returns (address){
    return getPrev(key);
  }
  /*Returns the TitleChain associated with this address*/
  function getNextTitleChain(address key) returns (address){
    return getNext(key);
  }
  /*Returns the TitleChain associated with this address*/
  function getTitleChain(address key) returns (address){
    return titleChains[key];
  }
  /*Returns the TitleChain associated with this address*/
  function initTitleChain(string description) returns (address TitleChainAddr){
    address newTitleChain = new TitleChain(description);
    NewTitleChain(msg.sender, newTitleChain);
    bool ret = addElement(newTitleChain);
    return newTitleChain;
  }
}
contract ChainManagerFactory {
  address lastCreated;
  function create() returns (address GSAddr) {
    lastCreated = new ChainManager();
    return lastCreated;
  }

  function getLast() returns (address GSAddr) {
    return lastCreated;
  }
}