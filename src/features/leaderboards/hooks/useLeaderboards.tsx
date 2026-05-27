interface LeaderboardsProps {
    friends?: boolean,
    period?: 'daily' | 'weekly' | 'monthly',
    category?: 'album' | 'artist' | 'genre' | 'year' | 'tracklist',
    accuracy?: boolean
}

const useLeaderboards = ({
    friends,
    period,
    category,
    accuracy
}: LeaderboardsProps) => {
    // friends, period, category, accuracy

    // '/'

    // '/:period'
        
    // '/category/:category'
    // '/category/:category/:period'
    
    // '/accuracy/category/:category'
    // '/accuracy/category/:category/:period'
    
    // '/friends'
    // '/friends/:period'
    // '/friends/category/:category'
    // '/friends/category/:category/:period'
    // '/friends/accuracy/category/:category'
    // '/friends/accuracy/category/:category/:period'
    

  return (
    <div>useLeaderboards</div>
  )
}

export default useLeaderboards