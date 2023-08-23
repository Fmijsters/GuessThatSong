import "./podium.css"; // Make sure to have your styling in Podium.css

const Podium = ({scoreboard}) => {
    const sortedUserList = scoreboard.slice().sort((a, b) => b.points - a.points);
    while (sortedUserList.length < 3) {
        sortedUserList.push({user: "", points: 0});
    }
    let firstPlace = sortedUserList[0].user
    let secondPlace = sortedUserList[1].user
    let thirdPlace = sortedUserList[2].user
    return (
        <div className="podium">
            {secondPlace && <div className="podium-place">
                <div className="podium-number">2</div>
                <div className="podium-name">{secondPlace}</div>
                <div className="podium-block block-silver"></div>
            </div>}

            {firstPlace && <div className="podium-place">
                <div className="podium-number">1</div>
                <div className="podium-name">{firstPlace}</div>
                <div className="podium-block block-gold"></div>
            </div>}

            {thirdPlace && <div className="podium-place">
                <div className="podium-number">3</div>
                <div className="podium-name">{thirdPlace}</div>
                <div className="podium-block block-bronze"></div>
            </div>}
        </div>
    );
};

export default Podium;
