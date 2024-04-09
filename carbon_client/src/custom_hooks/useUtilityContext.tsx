import { useContext } from 'react'
import { UtilityContext } from '../context/Utility.context';

export const useUtilityContext = () => {
    const context = useContext(UtilityContext);
    if (!context) {
      throw new Error('The context must be used within a provider.');
    }
    return context;
}
