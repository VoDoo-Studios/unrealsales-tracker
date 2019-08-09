const TrackJSLogger = store => next => action => {
    try {
        // log every action so they appear in the TrackJS telemetry timeline
        console.log(action);
        return next(action)
    } catch (err) {
        // Something bad happened, lets log out the entire state so we can see it in the timeline
        console.warn(store.getState());

        // NOTE: this assumes TrackJS was initialized previously, at app startup.
        window.TrackJS && window.TrackJS.track(err);
    }
}

export default TrackJSLogger;