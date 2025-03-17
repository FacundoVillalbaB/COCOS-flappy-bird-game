import { _decorator, Component, Node, Vec3, screen, find, UITransform } from 'cc';
const { ccclass, property } = _decorator;

const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

@ccclass('Pipes')
export class Pipes extends Component {
    @property({ type: Node }) public topPipe: Node;
    @property({ type: Node }) public bottomPipe: Node;

    public tempStartLocationUp: Vec3 = new Vec3(0, 0, 0);
    public tempStartLocationDown: Vec3 = new Vec3(0, 0, 0);
    public scene = screen.windowSize;

    public game: any;  // GameCtrl reference
    public pipeSpeed: number;
    public tempSpeed: number;

    isPass: boolean;

    onLoad() {
        const gameNode = find("GameCtrl");
        if (!gameNode) {
            console.error("GameCtrl node not found!");
            return;
        }

        this.game = gameNode.getComponent("GameCtrl");
        if (!this.game) {
            console.error("GameCtrl component not found!");
            return;
        }

        this.pipeSpeed = this.game.pipeSpeed;
        this.initPos();
        this.isPass = false;
    }

    initPos() {
        if (!this.topPipe || !this.bottomPipe) {
            console.error("Pipes not assigned in the Inspector!");
            return;
        }

        this.tempStartLocationUp.x = (this.topPipe.getComponent(UITransform)?.width || 0) + this.scene.width;
        this.tempStartLocationDown.x = (this.bottomPipe.getComponent(UITransform)?.width || 0) + this.scene.width;

        let gap = random(90, 100);
        let topHeight = random(0, 450);

        this.tempStartLocationUp.y = topHeight;
        this.tempStartLocationDown.y = topHeight - (gap * 10);

        this.topPipe.setPosition(this.tempStartLocationUp);
        this.bottomPipe.setPosition(this.tempStartLocationDown);
    }

    update(deltaTime: number) {  // ✅ Fixed function name
        if (!this.topPipe || !this.bottomPipe) return;

        this.tempSpeed = this.pipeSpeed * deltaTime;

        this.tempStartLocationDown = this.bottomPipe.position;
        this.tempStartLocationUp = this.topPipe.position;

        this.tempStartLocationDown.x -= this.tempSpeed;
        this.tempStartLocationUp.x -= this.tempSpeed;

        this.bottomPipe.setPosition(this.tempStartLocationDown);
        this.topPipe.setPosition(this.tempStartLocationUp);

        if (!this.isPass && this.topPipe.position.x <= 0) {
            this.isPass = true;
            this.game.passPipe();
        }

        if (this.topPipe.position.x < -this.scene.width) {
            this.game.createPipe();
            this.destroy();
        }
    }
}
