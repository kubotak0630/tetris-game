export default class AudioCtrl {
  private _audio: HTMLAudioElement;

  constructor(filePath: string) {
    this._audio = new Audio(filePath);

    // load()直後に再生しないようにautoplayをfalseに設定
    this._audio.autoplay = false;
    this._audio.volume = 0.4;

    this._audio.load();

    //連続再生の設定
    this._audio.addEventListener(
      'ended',
      () => {
        this._audio.currentTime = 0;
        this._audio.play();
      },
      false
    );
  }

  play() {
    this._audio.play();
  }
  pause() {
    this._audio.pause();
  }
  //次回は最初から再生
  stop() {
    this._audio.pause();
    this._audio.currentTime = 0;
  }
}
