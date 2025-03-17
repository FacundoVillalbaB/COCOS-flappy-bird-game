import { _decorator, Component, Node, CCInteger, Input, input, EventKeyboard, KeyCode, director,Contact2DType, Collider2D,IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from './Ground';
import { Results } from './Results';
import { Bird } from './Bird';
import { PipePool } from './PipePool';

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    @property({
        type:Component

    }) public ground: Ground;

    @property({
        type: CCInteger

    }) public speed: number = 200;
    @property({
        type: CCInteger

    }) public pipeSpeed: number = 200;
    @property({
        type: Results
    }) public result: Results;
    @property({
        type: Bird
    }) public bird: Bird;
    @property({
        type:PipePool
    }) public pipeQueue: PipePool;

    public isOver:boolean;

    initListener(){
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.on(Node.EventType.TOUCH_START,() => {
            if (this.isOver == true) {
                this.resetGame();
                this.bird.resetBird();
                this.startGame();
            }
              if (this.isOver == false) {
                this.bird.fly();
            }
        })



    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
              this.gameOver();
              break;
            case KeyCode.KEY_P:
              this.result.addScore();
              break;
            case KeyCode.KEY_Q:
              this.resetGame();
              this.bird.resetBird();
          }
    }

    gameOver() {
        this.result.showResult();
        this.isOver = true;
        director.pause();
    }

    resetGame() {
        this.result.resetScore();
        this.pipeQueue.reset();
        this.isOver = false;
        this.startGame();
    }

    startGame(){
        this.result.hideResult();
        director.resume();
    }

    onLoad() {
        this.initListener();
        this.result.resetScore();
        this.isOver = true;
        director.pause();

    }

    passPipe() {
        this.result.addScore();
    }
    createPipe() {
        this.pipeQueue.addPool();
    }
    contactGroundPipe() {
        let collider = this.bird.getComponent(Collider2D);
    
        if (collider) {
          collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
      }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    this.bird.hitSomething = true;
  }
  birdStruck() {
    this.contactGroundPipe()

    if (this.bird.hitSomething == true)
    {
        this.gameOver();
    }
      
  }
  update(){
    if (this.isOver == false){
        this.birdStruck();
    }
    
  }
}


